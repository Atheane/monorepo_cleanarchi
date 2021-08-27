import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import * as request from 'supertest';
import * as nock from 'nock';
import * as path from 'path';
import { bootstrap } from './config/bootstrap';

const app = express();

describe('HealthCheck integration testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    nock.back.fixtures = path.resolve(`${__dirname}/insurance/fixtures/`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');
    await bootstrap(app, envPath, process.env.MONGO_URL);
    nockDone();
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    nock.enableNetConnect(/127\.0\.0\.1/);
  });

  it('Should send ok', async () => {
    await request(app).get('/subscription/status').expect(200);
  });
});
