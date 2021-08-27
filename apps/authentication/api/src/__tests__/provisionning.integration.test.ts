import 'reflect-metadata';
import { Application } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import * as nock from 'nock';
import { Container } from 'inversify';
import * as path from 'path';
import { getUserToken, user } from './fixtures/auth.fixtures';
import { bootstrap } from './fixtures/bootstrap';
import {
  getUserPhoneProvisionedToken,
  userPhoneProvisioned,
  consultResponseFixture,
  provisionResponseFixture,
  encryptedDataWithInvalidPanFixture,
  encryptedDataWithValidPanFixture,
} from './fixtures/refauth.fixtures';
import { envConfiguration } from '../config/server/Envs';
import { ProvisionUserCardCommand } from '../modules/provisionning/commands/ProvisionUserCardCommand';
import { useExtraFeature } from '../modules/provisionning/ProvisionningController';

const app: Application = express();

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        name: 'AzureBus',
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          addRule: jest.fn(),
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
            receiveMessages: jest.fn().mockReturnValue([]),
          }),
        }),
      }),
    },
  };
});

describe('Provisionning integration api testing', () => {
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    await getUserToken(container);
    await getUserPhoneProvisionedToken(container);
  });

  it('Should provision user', async () => {
    const {
      icgRefAuthBaseUrl,
      icgRefAuthPath,
      odbCompanyCode,
    } = envConfiguration.getLocalVariables().icgConfig;
    const refauthPathWithCompanyCode = icgRefAuthPath.replace('$companyCode', odbCompanyCode);
    const returnCodeOK = '0';

    nock(icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(
        200,
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header><peg:groupContext xmlns:peg="http://www.bpce.fr/xsd/peg/PEG_v0">' +
          '<peg:requestContext><peg:requestId>48f01c19-d5ce-4994-bca8-16242b5165b8</peg:requestId>' +
          '</peg:requestContext><peg:consumerContext><peg:application><peg:name>BD-FRA</peg:name><peg:version>1.0</peg:version>' +
          '<peg:organisation>ONEY</peg:organisation></peg:application><peg:run><peg:companyCode>12869</peg:companyCode></peg:run>' +
          '</peg:consumerContext><peg:goalContext/></peg:groupContext></soap:Header><soap:Body>' +
          '<ns2:provisionnerClientResponse xmlns:ns2="http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth" xmlns:ns3="http://www.bpce.fr/xsd/peg/PEG_v0">' +
          `<RepnEnrlClnt><BlocRetr><CdTypeRetr>${returnCodeOK}</CdTypeRetr></BlocRetr></RepnEnrlClnt></ns2:provisionnerClientResponse></soap:Body></soap:Envelope>`,
      );

    // Given
    const payload = {
      phone: '365649989',
      userId: user.props.uid,
      useIcgSmsAuthFactor: true,
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/phone`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicAuthKey}`)
      .send(payload)
      .expect(201);
  });

  it('Should provision user even when icg disabled', async () => {
    const {
      icgRefAuthBaseUrl,
      icgRefAuthPath,
      odbCompanyCode,
    } = envConfiguration.getLocalVariables().icgConfig;
    const refauthPathWithCompanyCode = icgRefAuthPath.replace('$companyCode', odbCompanyCode);
    const returnCodeOK = '0';

    nock(icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(
        200,
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header><peg:groupContext xmlns:peg="http://www.bpce.fr/xsd/peg/PEG_v0">' +
          '<peg:requestContext><peg:requestId>48f01c19-d5ce-4994-bca8-16242b5165b8</peg:requestId>' +
          '</peg:requestContext><peg:consumerContext><peg:application><peg:name>BD-FRA</peg:name><peg:version>1.0</peg:version>' +
          '<peg:organisation>ONEY</peg:organisation></peg:application><peg:run><peg:companyCode>12869</peg:companyCode></peg:run>' +
          '</peg:consumerContext><peg:goalContext/></peg:groupContext></soap:Header><soap:Body>' +
          '<ns2:provisionnerClientResponse xmlns:ns2="http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth" xmlns:ns3="http://www.bpce.fr/xsd/peg/PEG_v0">' +
          `<RepnEnrlClnt><BlocRetr><CdTypeRetr>${returnCodeOK}</CdTypeRetr></BlocRetr></RepnEnrlClnt></ns2:provisionnerClientResponse></soap:Body></soap:Envelope>`,
      );

    // Given
    const payload = {
      phone: '365649989',
      userId: user.props.uid,
      useIcgSmsAuthFactor: false,
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/phone`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicAuthKey}`)
      .send(payload)
      .expect(201);
  });
  it('Should return a 201 even when icg disabled when provisioning user failed because phone set to true successfully', async () => {
    const {
      icgRefAuthBaseUrl,
      icgRefAuthPath,
      odbCompanyCode,
    } = envConfiguration.getLocalVariables().icgConfig;
    const refauthPathWithCompanyCode = icgRefAuthPath.replace('$companyCode', odbCompanyCode);
    const returnCodeKO = '0';

    nock(icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(
        200,
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header><peg:groupContext xmlns:peg="http://www.bpce.fr/xsd/peg/PEG_v0">' +
          '<peg:requestContext><peg:requestId>48f01c19-d5ce-4994-bca8-16242b5165b8</peg:requestId>' +
          '</peg:requestContext><peg:consumerContext><peg:application><peg:name>BD-FRA</peg:name><peg:version>1.0</peg:version>' +
          '<peg:organisation>ONEY</peg:organisation></peg:application><peg:run><peg:companyCode>12869</peg:companyCode></peg:run>' +
          '</peg:consumerContext><peg:goalContext/></peg:groupContext></soap:Header><soap:Body>' +
          '<ns2:provisionnerClientResponse xmlns:ns2="http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth" xmlns:ns3="http://www.bpce.fr/xsd/peg/PEG_v0">' +
          `<RepnEnrlClnt><BlocRetr><CdTypeRetr>${returnCodeKO}</CdTypeRetr></BlocRetr></RepnEnrlClnt></ns2:provisionnerClientResponse></soap:Body></soap:Envelope>`,
      );

    // Given
    const payload = {
      phone: '365649989',
      userId: user.props.uid,
      useIcgSmsAuthFactor: false,
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/phone`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicAuthKey}`)
      .send(payload)
      .expect(201);
  });

  it('Should provision card', async () => {
    const { icgConfig } = envConfiguration.getLocalVariables();
    const refauthPathWithCompanyCode = icgConfig.icgRefAuthPath.replace(
      '$companyCode',
      icgConfig.odbCompanyCode,
    );
    // mock consult request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, consultResponseFixture);

    // mock acs provisioning request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, provisionResponseFixture);

    // Given
    const payload: ProvisionUserCardCommand = {
      cardId: 'card-123',
      userId: userPhoneProvisioned.props.uid,
      encryptedData: encryptedDataWithValidPanFixture,
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/card`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .send(payload)
      .expect(201);
  });

  it('Should fail to provision card when invalid PAN in encrypted card data', async () => {
    const { icgConfig } = envConfiguration.getLocalVariables();
    const refauthPathWithCompanyCode = icgConfig.icgRefAuthPath.replace(
      '$companyCode',
      icgConfig.odbCompanyCode,
    );
    // mock consult request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, consultResponseFixture);

    // mock acs provisioning request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, provisionResponseFixture);

    // Given
    const payload: ProvisionUserCardCommand = {
      cardId: 'card-123',
      userId: userPhoneProvisioned.props.uid,
      encryptedData: encryptedDataWithInvalidPanFixture,
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/card`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .send(payload)
      .expect(400);
  });

  it('Should fail to provision card because bad encrypted data', async () => {
    const { icgConfig } = envConfiguration.getLocalVariables();
    const refauthPathWithCompanyCode = icgConfig.icgRefAuthPath.replace(
      '$companyCode',
      icgConfig.odbCompanyCode,
    );
    // mock consult request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, consultResponseFixture);

    // mock acs provisioning request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, provisionResponseFixture);

    // Given
    const payload: ProvisionUserCardCommand = {
      cardId: 'card-123',
      userId: userPhoneProvisioned.props.uid,
      encryptedData: 'dGhpcyBpcyBlbmNyeXB0ZWQgZGF0YQ==',
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/card`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .send(payload)
      .expect(400);
  });

  it('Should fail to provision card because wrong auth token', async () => {
    const { icgConfig } = envConfiguration.getLocalVariables();
    const refauthPathWithCompanyCode = icgConfig.icgRefAuthPath.replace(
      '$companyCode',
      icgConfig.odbCompanyCode,
    );
    // mock consult request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, consultResponseFixture);

    // mock acs provisioning request
    nock(icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, provisionResponseFixture);

    // Given
    const payload: ProvisionUserCardCommand = {
      cardId: 'card-123',
      userId: userPhoneProvisioned.props.uid,
      encryptedData: 'dGhpcyBpcyBlbmNyeXB0ZWQgZGF0YQ==',
    };

    const wrongAuthToken = '1234yu';

    return request(app)
      .post(`/authentication/${payload.userId}/provision/card`)
      .set('Authorization', `Basic ${wrongAuthToken}`)
      .send(payload)
      .expect(401);
  });

  it('Should failed provision user', async () => {
    // Given
    const payload = {
      phone: '365649989',
      userId: null,
      useIcgSmsAuthFactor: false,
    };

    return request(app)
      .post(`/authentication/${payload.userId}/provision/phone`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicAuthKey}`)
      .send(payload)
      .expect(400);
  });

  it('Should failed cause basicAuth no provided', async () => {
    // Given
    const payload = {
      phone: '365649989',
      userId: null,
      useIcgSmsAuthFactor: false,
    };

    return request(app).post(`/authentication/${payload.userId}/provision/phone`).send(payload).expect(401);
  });

  it('Should provision user password', async () => {
    await request(app)
      .post(`/authentication/123456/provision/password`)
      .send({
        password: '122456',
      })
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .expect(201);

    await request(app)
      .post(`/authentication/123456/provision/password`)
      .send({
        password: '12245',
      })
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .expect(400);

    await request(app)
      .post(`/authentication/123456/provision/password`)
      .send({
        password: '12245789',
      })
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .expect(400);
    container.unbind(useExtraFeature);
    container.bind<boolean>(useExtraFeature).toConstantValue(false);
    await request(app)
      .post(`/authentication/123456/provision/password`)
      .send({
        password: '122456',
      })
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .expect(404);
  });

  it('Should ban a user', async () => {
    container.unbind(useExtraFeature);
    container.bind<boolean>(useExtraFeature).toConstantValue(true);
    await request(app)
      .post(`/authentication/123456/ban`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .expect(200);

    container.unbind(useExtraFeature);
    container.bind<boolean>(useExtraFeature).toConstantValue(false);
    await request(app)
      .post(`/authentication/123456/ban`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicRefAuthKey}`)
      .expect(404);
  });
});
