/* eslint-disable */
import * as nock from 'nock';
import { AxiosInstance, AxiosError } from 'axios';
import { AxiosHttpMethod, httpBuilder } from '../http';

function setupResponses(client: AxiosInstance, responses) {
  const configureResponse = () => {
    for (const resp of responses) {
      resp();
      continue;
    }
  };
  client.interceptors.response.use(
    result => {
      configureResponse();
      return result;
    },
    error => {
      configureResponse();
      return Promise.reject(error);
    },
  );
  configureResponse();
}

const NETWORK_ERROR = new Error('Some connection error');

const circuit_timeout = 3000;
const max_retries = 2;
const client = httpBuilder(new AxiosHttpMethod()).setMaxRetries(max_retries).circuitDuration(circuit_timeout);
client.configureRetry({
  retryCondition: () => true,
  retryDelay: 5000,
  useExponentialRetryDelay: true,
});

describe('Circuit breaker integration test', () => {
  let baseUrl: string;
  let pokemonUrl: string;

  beforeEach(() => {
    baseUrl = 'https://pokemongo.com';
    pokemonUrl = 'pokemon/bulbasaur/';
  });

  it(`Client must throw an error and should be in OPEN after ${max_retries} max_retries failed`, async () => {
    try {
      setupResponses(client.getClient<AxiosInstance>(), [
        () => nock('http://example.com').get('/test').replyWithError(NETWORK_ERROR),
        () => nock('http://example.com').get('/test').replyWithError(NETWORK_ERROR),
        () => nock('http://example.com').get('/test').reply(200, 'It worked!'),
      ]);
      const t = await client.get('http://example.com/test').execute();
      if (t.status === 200) {
        throw new Error('Request shouldnt pass cause client must retry only 2 times');
      }
    } catch (e) {
      expect(client.getInstance<AxiosHttpMethod>().mode).toEqual('OPEN');
    }
  });
  it('Should reject me cause OPEN mode is activated, have to wait 3 seconds circuit_timeout', async () => {
    try {
      const t = await client.get('http://example.com/test').execute();
      if (t.status === 200) {
        throw new Error('Request shouldnt pass cause client must retry only 2 times');
      }
    } catch (e) {
      expect(client.getInstance<AxiosHttpMethod>().mode).toEqual('OPEN');
    }
  });
  it(`After ${
    circuit_timeout / 1000
  } seconds duration set in circuit_timeout, client must be in HALF_OPEN`, function (done) {
    jest.setTimeout(4000);
    setTimeout(function () {
      expect(client.getInstance<AxiosHttpMethod>().mode).toEqual('HALF_OPEN');
      done();
    }, 3000);
  });
  it(`After circuit passed in HALF_OPEN, a fail should reconduct to OPEN mode`, async () => {
    try {
      nock(baseUrl).get( '/' + pokemonUrl + 'ziaejoizej').reply(503)
      await client.get(baseUrl + pokemonUrl + 'ziaejoizej').execute();
      if (client.getInstance<AxiosHttpMethod>().mode === 'CLOSED') {
        throw new Error('This have to be in OPEN mode');
      }
    } catch (e) {
      expect(client.getInstance<AxiosHttpMethod>().mode).toEqual('OPEN');
    }
  });

  it(`After repassed in OPEN mode, should wait to recover in HALF_OPEN`, function (done) {
    jest.setTimeout(4000);
    setTimeout(function () {
      expect(client.getInstance<AxiosHttpMethod>().mode).toEqual('HALF_OPEN');
      done();
    }, 3000);
  });

  it('Should not retry request cause error status is not allowed to retry', async () => {
    const newInstance = httpBuilder(new AxiosHttpMethod()).setMaxRetries(max_retries).circuitDuration(3000);
    const waitingResponse = 'Go go Go go';
    setupResponses(newInstance.getClient<AxiosInstance>(), [
      () => nock('http://example.comsoqpkd').get('/test').reply(400, 'Will retry here'),
      () => nock('http://example.comsoqpkd').get('/test').reply(404, waitingResponse),
      () => nock('http://example.comsoqpkd').get('/test').reply(200, 'It does not have to be trigger'),
    ]);
    newInstance.configureRetry({
      retryCondition: (error: AxiosError) => {
        if (error.response.status === 404) {
          return false;
        }
        return true;
      },
      retryDelay: 1000,
      useExponentialRetryDelay: true,
    });
    try {
      const t = await newInstance.get('http://example.comsoqpkd/test').execute();
      if (t.status >= 201) {
        throw new Error('This does not have to happen');
      }
    } catch (e) {
      expect(e.response.data).toEqual(waitingResponse);
    }
  });
  it('Should retry request cause error status is equal to 502', async () => {
    const newInstance = httpBuilder(new AxiosHttpMethod()).setMaxRetries(3).circuitDuration(3000);
    const waitingResponse = 'Go go Go go';
    setupResponses(newInstance.getClient<AxiosInstance>(), [
      () => nock('http://example.comszzoqpkd').get('/test').reply(502, 'Will retry here'),
      () => nock('http://example.comszzoqpkd').get('/test').reply(502, 'Will retry here'),
      () => nock('http://example.comszzoqpkd').get('/test').reply(200, waitingResponse),
    ]);
    newInstance.configureRetry({
      retryCondition: (error: AxiosError) => {
        return false;
      },
      retryDelay: 1000,
      useExponentialRetryDelay: true,
    });
    const t = await newInstance.get('http://example.comszzoqpkd/test').execute();
    expect(t.data).toEqual(waitingResponse);
  });
  it('Should not retry request cause error status is equal to 503 then 400', async () => {
    const newInstance = httpBuilder(new AxiosHttpMethod()).setMaxRetries(3).circuitDuration(3000);
    const waitingResponse = 'Go go Go go';
    setupResponses(newInstance.getClient<AxiosInstance>(), [
      () => nock('http://example.comszzoqpkds').get('/test').reply(503, 'Will retry here'),
      () => nock('http://example.comszzoqpkds').get('/test').reply(400, waitingResponse),
      () => nock('http://example.comszzoqpkds').get('/test').reply(200, 'should not reach this'),
    ]);
    newInstance.configureRetry({
      retryCondition: (error: AxiosError) => {
        return false;
      },
      retryDelay: 1000,
      useExponentialRetryDelay: true,
    });
    try {
      await newInstance.get('http://example.comszzoqpkds/test').execute();
    } catch (e) {
      expect(e.response.data).toEqual(waitingResponse);
    }
  });
  it('Should stop cause 400 is provided and not 503', async () => {
    const newInstance = httpBuilder(new AxiosHttpMethod())
      .setMaxRetries(3)
      .circuitDuration(3000)
      .statusCodesForRetry([400]);
    const waitingResponse = 'Go go Go go';
    setupResponses(newInstance.getClient<AxiosInstance>(), [
      () => nock('http://example.comszzoqpkdssbcjds').get('/test').reply(503, waitingResponse),
      () => nock('http://example.comszzoqpkdssbcjds').get('/test').reply(400, 'shouold not reach 400'),
      () => nock('http://example.comszzoqpkdssbcjds').get('/test').reply(200, 'should not reach this'),
    ]);
    newInstance.configureRetry({
      retryCondition: (error: AxiosError) => {
        return false;
      },
      retryDelay: 1000,
      useExponentialRetryDelay: true,
    });
    try {
      await newInstance.get('http://example.comszzoqpkdssbcjds/test').execute();
      throw new Error('It should not happen');
    } catch (e) {
      expect(e.response.data).toEqual(waitingResponse);
    }
  });
});
