/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  AuthErrors,
  Authorization,
  DecodeIdentity,
  IdentityProvider,
  Permission,
  Role,
  Scope,
  ServiceName,
} from '@oney/identity-core';
import { Container } from 'inversify';
import * as jwt from 'jsonwebtoken';
import * as nock from 'nock';
import * as path from 'path';
import { configureIdentityLib } from '../di/build';
import { AzureIdentityDecoder } from '../adapters/gateways/AzureIdentityDecoder';
import { OdbIdentityDecoder } from '../adapters/gateways/OdbIdentityDecoder';

const container = new Container();
const jwtSecret = 'secret';
const azureAdToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMi0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjEyMjYzMDg2LCJuYmYiOjE2MTIyNjMwODYsImV4cCI6MTYxMjI2Njk4NiwiYWlvIjoiRTJaZ1lDamJaTCs5OUxhK2VkOW5WK1BIbFJiOUFBPT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInN1YiI6IjZmYWRlNTBmLWVmMjMtNDJmNi1iM2U4LWFiMmY5YjEwN2Y4NiIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OSIsInV0aSI6InozSmtndktYMjBld1lQZ2ZSbEl2QUEiLCJ2ZXIiOiIxLjAifQ.gE4NEzpEp7dTWbNS-5Kiq-1bWXPNlbktOJnSEcTKc7GqqJEIbXVoKqbspVvmqtm_-XvwmI_Zon2QYZBJw9elXy92JtteCK5t1UpL5rk0-SNJQg6EQv8S6QovcO1OasRh9uNBPxB5_-7tbZMdaCYo8i6A13I9gNaGGnpdkkAXJo_0Y6mGoFaIREIDUkvYJLrVnNhe_7naxTuTAkpiEraKBq5_RIVji3sjHGVeYdUgp8wUCDbgWyPlidbKnG8hgjkZowdEu1SgK7kQyNf_j6ncO78c3FJFut8yqIW8IWqdl-_CrStOhIwNdwVBdfQEdTei0HxFbRuNH7XyNEC5mwX3ZA';
const azureAdTokenWithGroup =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJhcGk6Ly83MTBmMWRhNS1lYzNjLTQ0MzUtYTYyMS04YmQ2MjA0MjgwNzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjEyMjU0NjI0LCJuYmYiOjE2MTIyNTQ2MjQsImV4cCI6MTYxMjI1ODUyNCwiYWlvIjoiRTJaZ1lQRE5YbEZ4dHBXMXlETG9yNlB4NlZ1bkFBPT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInJvbGVzIjpbImF1dGhlbnRpY2F0aW9uLndyaXRlLmFsbCIsImF1dGhlbnRpY2F0aW9uLndyaXRlLnNlbGYiLCJhdXRoZW50aWNhdGlvbi5yZWFkLmFsbCIsImF1dGhlbnRpY2F0aW9uLnJlYWQuc2VsZiJdLCJzdWIiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJ0aWQiOiIxY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkiLCJ1dGkiOiJleHFLTHZjRy1FYUFyRzVfREUxNkFBIiwidmVyIjoiMS4wIn0.AWI6AwDt1cVNcVwudKcKJsnimhSvBfUqTLzkXawE4QncaxTPPAN7JG-h3evDkRs7n8sr_uxEzeZWaxV94J2OQZ0sN7HtvsmIu0cnISK-ouGm41vEioxf_f303EEKi2y8YJDVT3tXHAyFx48bWiZCMh713ZgjDlBJXMSySSyFnxWOJZbxZYpHD6zsl5_J8Qmr_NnMkP-U0lnmRoJoB-vNP-4XavpBd0JVYwmd8lysHPaIGWf8wXLmEhTGOHdYGNkhp1_im3C4DC6s-FW7IQfp6uAh80hJ4In0IesfYj9MvqsYbLW4D2fTyU4nz0uVJzBnyzx-3EJDD3ZwpIpv63G87A';
const expiredToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMi0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjEyMjYzMDg2LCJuYmYiOjE2MTIyNjMwODYsImV4cCI6MTUxMzEzMDMxMSwiYWlvIjoiRTJaZ1lDamJaTCs5OUxhK2VkOW5WK1BIbFJiOUFBPT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInN1YiI6IjZmYWRlNTBmLWVmMjMtNDJmNi1iM2U4LWFiMmY5YjEwN2Y4NiIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OSIsInV0aSI6InozSmtndktYMjBld1lQZ2ZSbEl2QUEiLCJ2ZXIiOiIxLjAifQ.LJe1yuB7mVGPT5hLxq8s9J18wGJuueIWfbmHbpE9PXA';
const expiredOdbToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsiZW1haWwiOiJpZXZ2akB5b3BtYWlsLmNvbSIsInVpZCI6ImR5QmFTVm1JayJ9fSwiaWF0IjoxNjA4NTY3NzkwLCJleHAiOjMyMTc5MDcwMTEsImF1ZCI6Im9kYl9hdXRoZW50aWNhdGlvbl9kZXYiLCJpc3MiOiJvZGJfYXV0aGVudGljYXRpb24ifQ.t_ahUUxU0swScppk0Yl32WmwZLDj3LCrXKCRoy329wQ';
const serviceName = ServiceName.profile;

describe('Decode identity unit testing', () => {
  let decodeIdentity: DecodeIdentity;
  let saveFixture: Function;

  beforeAll(async () => {
    await configureIdentityLib(container, {
      azureTenantId: '1cbcfc5b-bfc4-46cf-9dd1-b61140309b99',
      jwtOptions: {
        ignoreExpiration: true,
      },
      secret: jwtSecret,
      serviceName: serviceName,
      azureClientIds: {
        oney_compta: '9efeb2ac-60a8-4e66-8d61-20aa36b56762',
        pp_de_reve: '2fcc35a7-6e49-4434-a080-6b57352c7a23',
      },
      applicationId: '00000002-0000-0000-c000-000000000000',
    });
    decodeIdentity = container.get(DecodeIdentity);
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    /**
     * nock back available modes:
     * - wild: all requests go out to the internet, don't replay anything, doesn't record anything
     * - dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
     * - record: use recorded nocks, record new nocks
     * - lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record
     * @see https://github.com/nock/nock#modes
     */
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should throw error cause bad identity is provided', async () => {
    const result = decodeIdentity.execute({
      holder: 'helloworld',
    });
    await expect(result).rejects.toThrow(AuthErrors.MalformedHolderIdentity);
  });

  it('Should throw error cause expired token is provided', async () => {
    const result = decodeIdentity.execute({
      holder: expiredToken,
    });
    await expect(result).rejects.toThrow(AuthErrors.IllegalIdentity);
  });

  it('Should decode user token and provide an Identity', async () => {
    const token = jwt.sign(
      {
        payload: {
          user: {
            uid: 'hello',
          },
        },
        provider: IdentityProvider.odb,
      },
      jwtSecret,
    );
    const result = await decodeIdentity.execute({
      holder: token,
      ipAddress: 'aaa',
    });
    expect(result.provider).toEqual(IdentityProvider.odb);
    expect(result.uid).toEqual('hello');
    expect(result.roles).toBeTruthy();
    expect(result.ipAddress).toBeTruthy();
  });

  it('Should throw error cause illegal token is provided', async () => {
    const token = jwt.sign(
      {
        payload: {
          user: {
            uid: 'hello',
          },
        },
      },
      jwtSecret,
    );
    const result = decodeIdentity.execute({
      holder: token,
    });

    await expect(result).rejects.toThrow(AuthErrors.IllegalIdentity);
  });

  it('Should route to odb decoder for legacy user token and throw error cause signature is not valid', async () => {
    const result = decodeIdentity.execute({
      holder:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsiZW1haWwiOiJpZXZ2akB5b3BtYWlsLmNvbSIsInVpZCI6ImR5QmFTVm1JayJ9fSwiaWF0IjoxNjA4NTY3NzkwLCJleHAiOjMyMTc5MDcwMTEsImF1ZCI6Im9kYl9hdXRoZW50aWNhdGlvbl9kZXYiLCJpc3MiOiJvZGJfYXV0aGVudGljYXRpb24ifQ.t_ahUUxU0swScppk0Yl32WmwZLDj3LCrXKCRoy329wQ',
    });
    await expect(result).rejects.toThrow(AuthErrors.MalformedHolderIdentity);
  });

  it('Should parse azureAd token and provide an identity without roles', async () => {
    const result = await decodeIdentity.execute({
      holder: azureAdToken,
    });
    expect(result.provider).toEqual(IdentityProvider.azure);
    expect(result.uid).toBeTruthy();
    expect(result.roles.length).toEqual(0);
  });

  it('Should parse azureAd token and provide an identity with roles', async () => {
    const result = decodeIdentity.execute({
      holder: azureAdTokenWithGroup,
    });
    await expect(result).rejects.toThrow(AuthErrors.IllegalIdentity);
  });

  it('Should throw RolesNotFound cause user roles is empty', async () => {
    const token = jwt.sign(
      {
        payload: {
          user: {
            uid: 'hello',
          },
        },
        provider: IdentityProvider.odb,
      },
      jwtSecret,
    );
    const result = await decodeIdentity.execute({
      holder: token,
    });
    expect(result.roles.length).toEqual(0);
    const isAuthorize = decodeIdentity.canExecute(result);
    await expect(isAuthorize).rejects.toThrow(AuthErrors.RolesNotFound);
  });

  it('Should throw ScopeNotFound cause user scope is missing for service', async () => {
    const token = jwt.sign(
      {
        payload: {
          user: {
            uid: 'hello',
          },
        },
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: {
              name: 'unknown',
            },
          },
        ],
      },
      jwtSecret,
    );
    const result = await decodeIdentity.execute({
      holder: token,
    });
    const isAuthorize = decodeIdentity.canExecute(result);
    await expect(isAuthorize).rejects.toThrow(AuthErrors.ScopeNotFound);
  });

  it('Should return true cause user is autorized to execute the action', async () => {
    const token = jwt.sign(
      {
        payload: {
          user: {
            uid: 'hello',
          },
        },
        provider: IdentityProvider.odb,
        roles: [
          {
            scope: new Scope({
              name: serviceName,
            }),
            permissions: new Permission({
              read: Authorization.self,
              write: Authorization.self,
            }),
          },
        ] as Role[],
      },
      jwtSecret,
    );
    const result = await decodeIdentity.execute({
      holder: token,
    });
    expect(result.roles[0].scope.name).toEqual(serviceName);
    const isAuthorize = await decodeIdentity.canExecute(result);
    expect(isAuthorize).toBeTruthy();
  });

  it('should fail to decode when odb user token is expired', async () => {
    const mock = jest
      .spyOn(OdbIdentityDecoder.prototype as any, '_verifyToken')
      .mockImplementationOnce(() => {
        throw new jwt.TokenExpiredError('TOKEN_EXPIRED', new Date('2018-09-22T15:00:00'));
      });
    const result = decodeIdentity.execute({
      holder: expiredOdbToken,
    });
    await expect(result).rejects.toThrow(AuthErrors.MalformedHolderIdentity);
    mock.mockReset();
  });

  it('should fail to decode when azure user token is expired', async () => {
    const mock = jest
      .spyOn(AzureIdentityDecoder.prototype as any, '_verifyToken')
      .mockImplementationOnce(() => {
        throw new jwt.TokenExpiredError('TOKEN_EXPIRED', new Date('2018-09-22T15:00:00'));
      });
    const result = decodeIdentity.execute({
      holder: expiredToken,
    });
    await expect(result).rejects.toThrow(AuthErrors.IllegalIdentity);
    mock.mockReset();
  });
});
