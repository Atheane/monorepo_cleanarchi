/**
 * @jest-environment node
 */
/* eslint-disable */
import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { configureIdentityLib } from '../di/build';
import {
  Authorization,
  CanExecuteResult,
  CanExecuteResultEnum,
  DecodeIdentity,
  EncodeIdentity,
  Identity,
  IdentityProvider,
  ScaErrors,
  ServiceName, VerifySca
} from '@oney/identity-core';
import * as nock from 'nock';
import { Usecase } from '@oney/ddd';

const container = new Container();
const jwtSecret = 'maytheforcebewithyou';

const scaToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmllcklkIjoiY2VVUVpvS2lhIiwiYWN0aW9uIjp7InR5cGUiOiJURVNUIiwicGF5bG9hZCI6Iu-_ve-_vWXvv71cbivvv70ifSwiY3VzdG9tZXIiOnsiZW1haWwiOiJzaGFsb20uZWxsZXphbUBnbWFpbC5jb20iLCJ1aWQiOiJxa3hrS2lfV3gifSwiZmFjdG9yIjoicGluQ29kZSIsImNoYW5uZWwiOm51bGwsImV4cGlyYXRpb25EYXRlIjoiMjAyMS0wMS0xMVQxNjo1OToxOC4wNjhaIiwiaWF0IjoxNjEwMzg0MDU4LCJleHAiOjE2MTAzODQzNTgsImF1ZCI6Im9kYl9hdXRoZW50aWNhdGlvbl9kZXYiLCJpc3MiOiJvZGJfYXV0aGVudGljYXRpb24ifQ.BCqjGGsVsO1tfBYzaUlCFIvmeBLiB1HHmDsAaEWB2VU';

@injectable()
class Test {
  log() {
    return '1';
  }
}


@injectable()
class TestSca implements Usecase<any, any>  {

  constructor(private readonly toto: Test) {
  }

  execute(request: any): Promise<any> | any {
    return request;
  }

  async canExecute(identity: Identity, request?: any): Promise<CanExecuteResult> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.credit);
    if (roles.permissions.read === Authorization.self || roles.permissions.write === Authorization.self) {
      return CanExecuteResult.sca_needed({
        payload: request,
        actionType: 'TEST',
      });
    }
    return CanExecuteResult.can();
  }
}

describe('Sca unit testing', () => {
  let encodeIdentity: EncodeIdentity;
  let decodeIdentity: DecodeIdentity;
  let scope: nock.Scope;
  let identity: Identity;
  let testSca: TestSca;
  beforeAll(async () => {
    const authUrl = 'https://dev-api.authentication.sca.hello';
    await configureIdentityLib(container, {
      azureTenantId: '1cbcfc5b-bfc4-46cf-9dd1-b61140309b99',
      jwtOptions: {
        ignoreExpiration: true,
      },
      secret: jwtSecret,
      serviceName: 'hello',
      frontDoorBaseApiUrl: authUrl, // Mandatory field if you use the authent' forte in the project.
      azureClientIds: {
        oney_compta: '9efeb2ac-60a8-4e66-8d61-20aa36b56762',
        pp_de_reve: '2fcc35a7-6e49-4434-a080-6b57352c7a23',
      },
      applicationId: '00000002-0000-0000-c000-000000000000',
    });
    encodeIdentity = container.get(EncodeIdentity);
    decodeIdentity = container.get(DecodeIdentity);
    container.bind(Test).to(Test);
    container.bind(TestSca).to(TestSca);
    testSca = container.get(TestSca);
    const token = await encodeIdentity.execute({
      uid: 'qkxkKi_Wx',
      email: 'aze',
      provider: IdentityProvider.odb,
    });

    identity = await decodeIdentity.execute({
      holder: token,
      scaHolder: scaToken,
    });
    scope = nock(authUrl);
  });

  beforeEach(() => {
    nock.cleanAll();
    scope.post('/authentication/sca/consume').reply(200);
  });

  it('Should trigger sca and resolved it cause sca is valid', async () => {
    scope.get('/authentication/sca/verifier').reply(200, {
      status: 'DONE',
      verifierId: 'IVRYhxpaB',
      factor: 'pinCode',
      expirationDate: '2021-01-11T16:20:59.386Z',
      valid: true,
      channel: null,
      credential: '6b1ebf65a57e521c042e8fc6a4ac0a95',
      action: {
        type: 'TEST',
        payload: Buffer.from('1').toString('base64'),
      },
      customer: { email: 'shalom.ellezam@gmail.com', uid: 'qkxkKi_Wx' },
      metadatas: null,
    });
    const isAuthorized = await testSca.canExecute(identity, 1);
    if (isAuthorized.result === CanExecuteResultEnum.SCA_NEEDED) {
      const verifySca = container.get(VerifySca);
      await verifySca.execute({
        identity,
        action: {
          type: isAuthorized.scaPayload.actionType,
          payload: isAuthorized.scaPayload.payload
        }
      })
    }
    const result = await testSca.execute(1);
    expect(result).toEqual(1);
  });

  it('Should trigger sca and throw error cause Sca is required', async () => {
    scope.get('/authentication/sca/verifier').reply(200, {
      status: 'DONE',
      verifierId: 'IVRYhxpaB',
      factor: 'pinCode',
      expirationDate: '2021-01-11T16:20:59.386Z',
      valid: true,
      channel: null,
      credential: '6b1ebf65a57e521c042e8fc6a4ac0a95',
      action: {
        type: 'TEST',
        payload: Buffer.from(JSON.stringify({ hello: 'world' })).toString('base64'),
      },
      customer: { email: 'shalom.ellezam@gmail.com', uid: 'qkxkKi_Wx' },
      metadatas: null,
    });
    const isAuthorized = await testSca.canExecute(identity, 1);

    if (isAuthorized.result === CanExecuteResultEnum.SCA_NEEDED) {
      const verifySca = container.get(VerifySca);
      const result = verifySca.execute({
        identity,
        action: {
          type: isAuthorized.scaPayload.actionType,
          payload: isAuthorized.scaPayload.payload
        }
      })
      await expect(result).rejects.toThrow(ScaErrors.ScaRequired);
    }

  });
});
