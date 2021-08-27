/**
 * @jest-environment node
 */
import { jest, beforeAll, describe, it, expect } from '@jest/globals';
import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import { ExpressAppInsightsMiddleware } from '../src';
import { AxiosHttpClientInterceptor } from '../src/AxiosHttpClientInterceptor';
import { HttpClientTracker } from '../src/HttpClientTracker';
import appinsights from '../src/applicationinsights-enhanced';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
const stringify = JSON.stringify;
JSON.stringify = function (data: any) {
  return stringify(data, getCircularReplacer());
};

// const sleep = (ms:number) => {
//   // console.log(`Sleeping for ${ms / 1000} seconds`);
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// };

beforeAll(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe('appinsights middleware with AxiosHttpClientInterceptor', () => {
  it('should call trackDependency', async () => {
    jest.useFakeTimers();
    const app = express();
    app.use(bodyParser.json());
    const appInsightsMiddleware = new ExpressAppInsightsMiddleware();
    const configuration = appInsightsMiddleware
      .configure(
        app,
        {
          instrumentationKey: '12345',
          trackBodies: true,
        },
        new AxiosHttpClientInterceptor(axios),
      )
      .start();

    const trackDependencySpy = jest.spyOn(HttpClientTracker.prototype, 'trackDependency');

    app.post('/test', async (req, res) => {
      const { data } = await axios({
        method: 'post',
        url: 'https://postman-echo.com/post?foo1=bar1&foo2=bar2',
        data: { ...req.body },
        headers: { 'Content-type': 'application/json' },
      });
      return res.status(200).send({ result: 'ok', data });
    });
    await request(app)
      .post('/test')
      .set('Content-type', 'application/json')
      .send({ name: 'john' })
      .then(async resp => {
        jest.advanceTimersByTime(10000);
        expect(resp.body.result).toEqual('ok');
        expect(trackDependencySpy).toHaveBeenCalledWith(
          ...[
            expect.objectContaining({
              baseURL: 'https://postman-echo.com',
              method: 'post',
              path: '/post?foo1=bar1&foo2=bar2',
              reqBody: JSON.stringify({ name: 'john' }),
              reqHeaders: expect.objectContaining({
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
              }),
              resBody: expect.objectContaining({
                args: { foo1: 'bar1', foo2: 'bar2' },
                data: { name: 'john' },
              }),
              resHeaders: expect.objectContaining({
                'content-type': 'application/json; charset=utf-8',
              }),
              status: 200,
            }),
          ],
        );
        expect(configuration.defaultClient).toEqual(
          expect.objectContaining({
            commonProperties: expect.objectContaining({
              resBody: expect.stringContaining('"result":"ok"'),
            }),
          }),
        );
      })
      .finally(() => {
        configuration.untrack();
        appinsights.dispose();
        trackDependencySpy.mockClear();
      });
  });

  it('should not call trackDependency', async () => {
    jest.useFakeTimers();
    const app = express();
    app.use(bodyParser.json());
    const appInsightsMiddleware = new ExpressAppInsightsMiddleware();
    const configuration = appInsightsMiddleware
      .configure(
        app,
        {
          instrumentationKey: '12345',
          trackBodies: false,
        },
        new AxiosHttpClientInterceptor(axios),
      )
      .start();

    const trackDependencySpy = jest.spyOn(HttpClientTracker.prototype, 'trackDependency');

    app.post('/test', async (req, res) => {
      const { data } = await axios({
        method: 'post',
        url: 'https://postman-echo.com/post?foo1=bar1&foo2=bar2',
        data: { ...req.body },
        headers: { 'Content-type': 'application/json' },
      });
      return res.status(200).send({ result: 'ok', data });
    });
    await request(app)
      .post('/test')
      .set('Content-type', 'application/json')
      .send({ name: 'john' })
      .then(async resp => {
        jest.advanceTimersByTime(10000);
        expect(resp.body.result).toEqual('ok');
        expect(trackDependencySpy).not.toHaveBeenCalledWith(
          ...[
            expect.objectContaining({
              baseURL: 'https://postman-echo.com',
            }),
          ],
        );
      })
      .finally(() => {
        configuration.untrack();
        appinsights.dispose();
        trackDependencySpy.mockClear();
      });
  });
});
