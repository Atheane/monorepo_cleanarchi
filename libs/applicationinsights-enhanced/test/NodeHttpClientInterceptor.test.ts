/**
 * @jest-environment node
 */
import { jest, beforeAll, describe, it, expect } from '@jest/globals';
import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import { ExpressAppInsightsMiddleware, HttpClientTracker, TelemetryClient } from '../src';
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

const sleep = (ms: number) => {
  // console.log(`Sleeping for ${ms / 1000} seconds`);
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

beforeAll(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe('appinsights middleware with NodeHttpClientInterceptor', () => {
  it('should call trackDependency', async () => {
    // jest.useFakeTimers();
    const app = express();
    app.use(bodyParser.json());
    const appInsightsMiddleware = new ExpressAppInsightsMiddleware();
    const configuration = appInsightsMiddleware
      .configure(app, {
        instrumentationKey: '12345',
        trackBodies: true,
      })
      .start();

    const trackDependencySpy = jest.spyOn(HttpClientTracker.prototype, 'trackDependency');
    const telemetryProcessorsSpy = jest.spyOn(TelemetryClient.prototype, 'runTelemetryProcessors' as any);

    app.post('/test', async (req, res) => {
      const { data } = await axios({
        method: 'post',
        url: 'https://postman-echo.com/post?foo1=bar1&foo2=bar2',
        data: { ...req.body },
        headers: { 'Content-type': 'application/json' },
      });
      return res.status(200).send({ result: 'ok', data });
    });
    const body = { name: 'john' };
    await request(app)
      .post('/test')
      .set('Content-type', 'application/json')
      .send(body)
      .then(async resp => {
        await sleep(1000);
        expect(resp.body.result).toEqual('ok');
        expect(trackDependencySpy).toHaveBeenCalledWith(
          ...[
            expect.objectContaining({
              baseURL: 'https://postman-echo.com',
              method: 'POST',
              path: '/post?foo1=bar1&foo2=bar2',
              reqBody: JSON.stringify({ name: 'john' }),
              reqHeaders: expect.objectContaining({
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
              }),
              resBody: expect.stringContaining(
                JSON.stringify({
                  args: { foo1: 'bar1', foo2: 'bar2' },
                  data: { name: 'john' },
                }).slice(0, -1),
              ),
              resHeaders: expect.objectContaining({
                'content-type': 'application/json; charset=utf-8',
              }),
              status: 200,
            }),
          ],
        );
        expect(configuration.defaultClient.commonProperties.reqHeaders).toMatchObject({
          'content-type': 'application/json',
        });
        expect(configuration.defaultClient.commonProperties.reqBody).toMatchObject(body);
        // TODO: find a way to assert to the envelop sent to app insights
        // expect(telemetryProcessorsSpy).toHaveBeenNthCalledWith(
        //   3,
        //   expect.objectContaining({
        //     data: expect.objectContaining({
        //       baseData: expect.objectContaining({
        //         properties: expect.objectContaining({
        //           resHeaders: expect.stringMatching(/\"Express\"/),
        //         }),
        //       }),
        //     }),
        //   })
        // );
        expect(JSON.parse(configuration.defaultClient.commonProperties.resBody)).toMatchObject({
          result: 'ok',
        });
      })
      .finally(() => {
        configuration.untrack();
        appinsights.dispose();
        trackDependencySpy.mockClear();
        telemetryProcessorsSpy.mockClear();
      });
  });

  it('should not call trackDependency', async () => {
    jest.useFakeTimers();
    const app = express();
    app.use(bodyParser.json());
    const appInsightsMiddleware = new ExpressAppInsightsMiddleware();
    appInsightsMiddleware
      .configure(app, {
        instrumentationKey: '12345',
        trackBodies: false,
      })
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
        // configuration.untrack();
        appinsights.dispose();
        trackDependencySpy.mockRestore();
        trackDependencySpy.mockClear();
      });
  });
});
