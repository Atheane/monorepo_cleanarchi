/* eslint-disable */
/**
 * @jest-environment node
 */
import * as nock from 'nock';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Pokemon } from './pokeapi.types';
import { AxiosHttpMethod, Err, httpBuilder, AxiosConfiguration } from '../http';

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

type fakeApiGetResponse = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const circuit_timeout = 3000;
const max_retries = 5;
const request_timeout = 12000;
const baseUrl = 'https://pokeapi.co/api/v2/';
const client = httpBuilder(new AxiosHttpMethod())
  .setMaxRetries(max_retries)
  .circuitDuration(circuit_timeout)
  .setDefaultHeaders({
    Authorization: 'toto',
  });
client.setBaseUrl(baseUrl);
client.setResponseTimeout(request_timeout);

describe('Oney httpBuilder lib unit testing', () => {
  let pokemonUrl: string;

  beforeEach(() => {
    pokemonUrl = '/pokemon/bulbasaur/';
  });

  describe('Http builder configuration', () => {
    it('Expect baseUrl is equal to baseUrl preconfigured in axios configuration', async () => {
      expect(client.getConfiguration<AxiosRequestConfig>().baseURL).toEqual(baseUrl);
    });
    it('Should configure the http builder with base url with a custom time out', async () => {
      expect(client.getConfiguration<AxiosRequestConfig>().timeout).toEqual(request_timeout);
    });
    it('Should configure client with headers Authorization equal to toto', async () => {
      nock(baseUrl).get(pokemonUrl).reply(200)
      const result = await client.get(pokemonUrl).execute();
      expect(result.config.headers.Authorization).toEqual('toto');
    });
    it('Should add additionnal configuration to client', async () => {
      nock(baseUrl).get(pokemonUrl).reply(200)
      client.setAdditionnalHeaders({
        Hola: 'Halo',
      });
      const result = await client.get(pokemonUrl).execute();
      expect(result.config.headers.Hola).toEqual('Halo');
    });
    it('Should add additionnal configuration Naruto to headers', async () => {
      nock(baseUrl).get(pokemonUrl).reply(200)
      client.setAdditionnalHeaders({
        Naruto: 'Uzumaki',
      });
      const result = await client.get(pokemonUrl).execute();
      expect(result.config.headers.Naruto).toEqual('Uzumaki');
      expect(result.config.headers.Hola).toEqual('Halo');
    });
    it('Should reset headers configuration to client and Naruto must be undefinedd', async () => {
      nock(baseUrl).get(pokemonUrl).reply(200)
      client.setDefaultHeaders({
        Authorization: 'bearer',
      });
      const result = await client.get(pokemonUrl).execute();
      expect(result.config.headers.Authorization).toEqual('bearer');
      expect(result.config.headers.Naruto).toBeFalsy();
    });
    it('Request should failed cause timeout exceeded', async () => {
      nock(baseUrl).get(pokemonUrl).reply(200)
      const time = 0.3;
      try {
        await client.setResponseTimeout(time).get<Pokemon>(pokemonUrl).execute();
      } catch (e) {
        const error = e as Err;
        expect(error.message).toEqual(`timeout of ${time}ms exceeded`);
      }
    });
    it('Should resolve with a successful retry after 2 fails', async () => {
      try {
        const testClient = httpBuilder(new AxiosHttpMethod()).setMaxRetries(3).circuitDuration(3000);
        testClient.configureRetry({
          retryDelay: 3000,
          useExponentialRetryDelay: true,
          retryCondition: () => true,
        });
        setupResponses(testClient.getClient<AxiosInstance>(), [
          () => nock('http://example.com').get('/test').replyWithError(NETWORK_ERROR),
          () => nock('http://example.com').get('/test').replyWithError(NETWORK_ERROR),
          () => nock('http://example.com').get('/test').reply(200, 'It worked!'),
        ]);

        const t = await testClient.get('http://example.com/test').execute();
        expect(t.status).toEqual(200);
      } catch (e) {
        throw e;
      }
    });
    it('Should fail because client will retry 1 time', async () => {
      const newClient = httpBuilder(new AxiosHttpMethod()).setMaxRetries(1).circuitDuration(circuit_timeout);
      setupResponses(newClient.getClient<AxiosInstance>(), [
        () => nock('http://example.com').get('/test').replyWithError(NETWORK_ERROR),
        () => nock('http://example.com').get('/test').replyWithError(NETWORK_ERROR),
        () => nock('http://example.com').get('/test').reply(200, 'It worked!'),
      ]);

      newClient.configureRetry({
        retryDelay: 3000,
        useExponentialRetryDelay: true,
        retryCondition: () => true,
      });
      try {
        const result = await newClient.get('http://example.com/test').execute();
        if (result.status === 200) {
          throw new Error('This test doesnt have to work');
        }
      } catch (e) {
        expect(e.message).toEqual('Request cancel cause OPEN mode is activated');
      }
    });
  });

  describe('Unit testing on http request method', () => {
    const scope = nock('https://jsonplaceholder.typicode.com');

    const newClient = httpBuilder(new AxiosHttpMethod())
      .setMaxRetries(max_retries)
      .circuitDuration(circuit_timeout);
    newClient.setBaseUrl('https://jsonplaceholder.typicode.com');


    it('Should execute a get request', async () => {
      scope.get('/todos/1?get=get+params').reply(200, {
        completed: false,
      })
      const result = await newClient
        .get<fakeApiGetResponse>('/todos/1', { get: 'get params' })
        .execute();
      expect(result.data.completed).toEqual(false);
    });
    it('Should execute a post request', async () => {
      scope.post('/posts?params=i+am+a+params').reply(200, {
        id: 101,
      })

      newClient.setAdditionnalHeaders({
        Toto: 'Tata',
      });
      const result = await newClient
        .post<fakeApiGetResponse>('/posts', { firstname: 'michael' }, { params: 'i am a params' })
        .execute();
      expect(result.data.id).toEqual(101);
    });
    it('Should execute a patch request', async () => {
      scope.patch('/posts/1?patch=poaze').reply(200, {
        id: 1,
      })

      const result = await newClient.patch<fakeApiGetResponse>('/posts/1', {}, { patch: 'poaze' }).execute();
      expect(result.data.id).toEqual(1);
    });
    it('Should execute a put request', async () => {
      scope.put('/posts/1').reply(200, {
        id: 1,
      })
      const result = await newClient
        .put<fakeApiGetResponse>('/posts/1', { put: 'oazek' })
        .execute();
      expect(result.data.id).toEqual(1);
    });
    it('Should execute a delete request', async () => {
      scope.delete('/posts/1?hello=world').reply(200)
      const result = await newClient.delete('/posts/1', { id: 1 }, { hello: 'world' }).execute();
      expect(result.status).toEqual(200);
    });
  });

  describe('Unit testing on adding some config in request', () => {
    const scope = nock('https://jsonplaceholder.typicode.com');
    const newClient = httpBuilder(new AxiosHttpMethod())
      .setMaxRetries(max_retries)
      .circuitDuration(circuit_timeout);
    newClient.setBaseUrl('https://jsonplaceholder.typicode.com');

    it('Should not erase the GET method if we try to put POST method in configuration', async () => {
      scope.get('/todos/1?get=get+params').reply(200)

      const result = await newClient
        .setRequestsConfiguration({
          method: 'POST',
        })
        .get<fakeApiGetResponse>('/todos/1', { get: 'get params' })
        .execute();
      expect(result.config.method).toEqual('get');
    });

    it('Should add withCredential configuration to POST method', async () => {
      scope.post('/posts').reply(200)

      const result = await newClient
        .setRequestsConfiguration<AxiosConfiguration>({
          withCredentials: true,
        })
        .post<fakeApiGetResponse>('/posts', { firstname: 'michael' })
        .execute();
      expect(result.config.withCredentials).toEqual(true);
    });

    it('Should set headers without merge', async () => {
      scope.post('/posts', {
        firstname: 'michael'
      }).reply(200)

      const result = await newClient
        .setRequestsConfiguration<AxiosConfiguration>({
          withCredentials: true,
        })
        .setAdditionnalHeaders(
          {
            toto: 'toto',
          },
          true,
        )
        .post<fakeApiGetResponse>('/posts', { firstname: 'michael' })
        .execute();
      expect(result.config.headers.toto).toEqual('toto');
      scope.post('/posts', {
        firstname: 'michael'
      }).reply(200)

      const overrideHeaders = await newClient
        .setRequestsConfiguration<AxiosConfiguration>({
          withCredentials: true,
        })
        .setAdditionnalHeaders(
          {
            loto: 'keno',
          },
          true,
        )
        .post<fakeApiGetResponse>('/posts', { firstname: 'michael' })
        .execute();
      expect(overrideHeaders.config.headers.toto).toBeFalsy();
      expect(overrideHeaders.config.headers.loto).toEqual('keno');

      scope.post('/posts', {
        firstname: 'michael'
      }).reply(200)

      const deleteHeaders = await newClient
        .setRequestsConfiguration<AxiosConfiguration>({
          withCredentials: true,
        })
        .setAdditionnalHeaders({}, true)
        .post<fakeApiGetResponse>('/posts', { firstname: 'michael' })
        .execute();
      expect(deleteHeaders.config.headers.toto).toBeFalsy();
      expect(deleteHeaders.config.headers.loto).toBeFalsy();
    });

    it('Should set headers within request', async () => {
      scope.post('/posts?params=i+am+a+params', {
        firstname: 'michael'
      }).reply(200)

      const result = await newClient
        .setRequestsConfiguration<AxiosConfiguration>({
          withCredentials: true,
        })
        .post<fakeApiGetResponse>(
          '/posts',
          { firstname: 'michael' },
          { params: 'i am a params' },
          { toto: 'toto' },
        )
        .execute();
      expect(result.config.headers.toto).toEqual('toto');
      scope.get('/todos/1?get=get+params').reply(200)
      const getRequest = await newClient
        .get<fakeApiGetResponse>(
          '/todos/1',
          { get: 'get params' },
          {
            authorization: 'ok',
          },
        )
        .execute();
      expect(getRequest.config.headers.toto).toBeFalsy();
      expect(getRequest.config.headers.authorization).toEqual('ok');
      scope.put('/posts/1', {
        put: 'oazek'
      }, {
        reqheaders: {
          testPut: 'ok',
        }
      }).reply(200)
      const putRequest = await newClient
        .put<fakeApiGetResponse>('/posts/1', { put: 'oazek' }, null, {
          testPut: 'ok',
        })
        .execute();
      expect(putRequest.config.headers.toto).toBeFalsy();
      expect(putRequest.config.headers.authorization).toBeFalsy();
      expect(putRequest.config.headers.testPut).toEqual('ok');
      scope.patch('/posts/1?testPatch=ok', {}, {
        reqheaders: {
          testPatch: 'ok'
        }
      }).reply(200)
      const patchRequest = await newClient
        .patch<fakeApiGetResponse>(
          '/posts/1',
          {},
          {
            testPatch: 'ok',
          },
        )
        .execute();
      expect(patchRequest.config.headers.toto).toBeFalsy();
      expect(patchRequest.config.headers.authorization).toBeFalsy();
      scope.delete('/posts/1?testDelete=ok').reply(200)

      const deleteRequest = await newClient
        .delete(
          '/posts/1',
          { id: 1 },
          {
            testDelete: 'ok',
          },
        )
        .execute();
      expect(deleteRequest.config.headers.toto).toBeFalsy();
      expect(deleteRequest.config.headers.authorization).toBeFalsy();
      expect(deleteRequest.config.headers.testPatch).toBeFalsy();
    });
  });
});
