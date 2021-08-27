/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  DecodeIdentity,
  EncodeIdentity,
  Identity,
  IdentityProvider,
  RequestScaVerifier,
  ScaErrors,
  VerifySca,
} from '@oney/identity-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { configureIdentityLib } from '../di/build';

const container = new Container();
const jwtSecret = 'maytheforcebewithyou';

const scaToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmllcklkIjoiY2VVUVpvS2lhIiwiYWN0aW9uIjp7InR5cGUiOiJURVNUIiwicGF5bG9hZCI6Iu-_ve-_vWXvv71cbivvv70ifSwiY3VzdG9tZXIiOnsiZW1haWwiOiJzaGFsb20uZWxsZXphbUBnbWFpbC5jb20iLCJ1aWQiOiJxa3hrS2lfV3gifSwiZmFjdG9yIjoicGluQ29kZSIsImNoYW5uZWwiOm51bGwsImV4cGlyYXRpb25EYXRlIjoiMjAyMS0wMS0xMVQxNjo1OToxOC4wNjhaIiwiaWF0IjoxNjEwMzg0MDU4LCJleHAiOjE2MTAzODQzNTgsImF1ZCI6Im9kYl9hdXRoZW50aWNhdGlvbl9kZXYiLCJpc3MiOiJvZGJfYXV0aGVudGljYXRpb24ifQ.BCqjGGsVsO1tfBYzaUlCFIvmeBLiB1HHmDsAaEWB2VU';

describe('Sca identity unit testing', () => {
  let encodeIdentity: EncodeIdentity;
  let decodeIdentity: DecodeIdentity;
  let requestSca: RequestScaVerifier;
  let verifySca: VerifySca;
  let scope: nock.Scope;
  let identity: Identity;
  let identityWithoutScaToken: Identity;
  beforeAll(async () => {
    const authUrl = 'https://dev-api.authentication.sca.hello';
    await configureIdentityLib(container, {
      azureTenantId: '1cbcfc5b-bfc4-46cf-9dd1-b61140309b99',
      jwtOptions: {
        ignoreExpiration: true,
      },
      secret: jwtSecret,
      serviceName: 'hello',
      frontDoorBaseApiUrl: authUrl,
      azureClientIds: {
        oney_compta: '9efeb2ac-60a8-4e66-8d61-20aa36b56762',
        pp_de_reve: '2fcc35a7-6e49-4434-a080-6b57352c7a23',
      },
      applicationId: '00000002-0000-0000-c000-000000000000',
    });
    encodeIdentity = container.get(EncodeIdentity);
    decodeIdentity = container.get(DecodeIdentity);
    const token = await encodeIdentity.execute({
      uid: 'qkxkKi_Wx',
      email: 'aze',
      provider: IdentityProvider.odb,
    });

    identity = await decodeIdentity.execute({
      holder: token,
      scaHolder: scaToken,
    });

    identityWithoutScaToken = await decodeIdentity.execute({
      holder: token,
    });
    requestSca = container.get(RequestScaVerifier);
    verifySca = container.get(VerifySca);
    scope = nock(authUrl);
  });

  beforeEach(() => {
    nock.cleanAll();
    scope.post('/authentication/sca/consume').reply(200);
  });

  it('Should request sca cause action is scaRequired', async () => {
    scope.post('/authentication/sca/verifier').reply(
      403,
      {
        status: 'PENDING',
        verifierId: 'IVRYhxpaB',
        factor: 'pinCode',
        expirationDate: '2021-01-11T16:20:59.386Z',
        valid: false,
        channel: null,
        credential: '6b1ebf65a57e521c042e8fc6a4ac0a95',
        action: {
          type: 'TEST',
          payload: Buffer.from(JSON.stringify({ hello: 'world' }), 'base64').toString('utf-8'),
        },
        customer: { email: 'shalom.ellezam@gmail.com', uid: 'qkxkKi_Wx' },
        metadatas: null,
        code: '2FA_REQUESTED',
      },
      {
        sca_token: scaToken,
      },
    );
    const result = await requestSca.execute({
      action: {
        type: 'TEST',
        payload: JSON.stringify({
          hello: 'world',
        }),
      },
      identity,
    });
    expect(result.status).toEqual('PENDING');
    expect(result.valid).toBeFalsy();
    expect(result.scaToken).toBeTruthy();
  });

  it('Should throw error on requesting verifier', async () => {
    scope.post('/authentication/sca/verifier').reply(500);
    const result = requestSca.execute({
      action: {
        type: 'TEST',
        payload: JSON.stringify({
          hello: 'world',
        }),
      },
      identity,
    });
    await expect(result).rejects.toThrow(ScaErrors.ScaDefaultVerifierError);
  });

  it('Should verify sca', async () => {
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
      code: '2FA_REQUESTED',
    });

    const result = await verifySca.execute({
      identity: identity,
      action: {
        type: 'TEST',
        payload: JSON.stringify({
          hello: 'world',
        }),
      },
    });
    expect(result).toBeTruthy();
  });

  it('Should throw error cause action already consumed', async () => {
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
      consumedAt: new Date(),
      code: '2FA_REQUESTED',
    });

    const result = verifySca.execute({
      identity: identity,
      action: {
        type: 'TEST',
        payload: JSON.stringify({
          hello: 'world',
        }),
      },
    });
    await expect(result).rejects.toThrow(ScaErrors.ScaRequired);
  });

  it('Should throw error cause action is not valid', async () => {
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
      consumedAt: new Date(),
      code: '2FA_REQUESTED',
    });

    const result = verifySca.execute({
      identity: identity,
      action: {
        type: 'TEST',
        payload: JSON.stringify({
          hello: 'i am a corrupted payload',
        }),
      },
    });
    await expect(result).rejects.toThrow(ScaErrors.ScaRequired);
  });

  it('Should throw error cause no sca token is provided', async () => {
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
      consumedAt: new Date(),
      code: '2FA_REQUESTED',
    });

    const result = verifySca.execute({
      identity: identityWithoutScaToken,
      action: {
        type: 'TEST',
        payload: JSON.stringify({
          hello: 'i am a corrupted payload',
        }),
      },
    });
    await expect(result).rejects.toThrow(ScaErrors.ScaRequired);
  });

  it('Should throw error cause sca token is expired', async () => {
    scope.get('/authentication/sca/verifier').reply(403, {
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
      code: 'TOKEN_EXPIRED',
    });

    const result = verifySca.execute({
      identity: identity,
      action: {
        type: 'TEST',
        payload: JSON.stringify({ hello: 'world' }),
      },
    });
    await expect(result).rejects.toThrow(ScaErrors.ScaRequired);
  });

  it('Should throw error cause server throw a bad request', async () => {
    scope.get('/authentication/sca/verifier').reply(400);

    const result = verifySca.execute({
      identity: identity,
      action: {
        type: 'TEazaeST',
        payload: JSON.stringify({ hello: '555' }),
      },
    });
    await expect(result).rejects.toThrow(ScaErrors.ScaRequestError);
  });
});
