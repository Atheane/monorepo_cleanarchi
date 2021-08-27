import { AuthErrors, DecodeIdentity, Identity, IdentityProvider } from '@oney/identity-core';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { NextFunction, Request, Response } from 'express';
import { Usecase } from '@oney/ddd';
import { DecodeIdentityCommand } from '@oney/identity-core';
import { DomainError } from '@oney/common-core';

export class DecodeIdentityStub implements Usecase<DecodeIdentityCommand, Identity> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canExecute(identity: Identity): Promise<boolean> {
    return Promise.resolve(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: DecodeIdentityCommand): Promise<Identity> {
    return Promise.resolve({
      uid: 'test',
      roles: [],
      provider: 'odb' as IdentityProvider,
      name: 'test',
      ipAddress: request.ipAddress,
    });
  }
}

describe('Auth Middleware unit testing', () => {
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsidWlkIjoiQVd6Y2xQRnlOIiwiZW1haWwiOiJvenpqQHlvcG1haWwuY29tIn19LCJwcm92aWRlciI6Im9kYiIsInJvbGVzIjpbeyJzY29wZSI6eyJuYW1lIjoicHJvZmlsZSJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhZ2dyZWdhdGlvbiJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJub3RpZmljYXRpb25zIn0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoibm8iLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJjcmVkaXQifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoiYXV0aGVudGljYXRpb24ifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoicGF5bWVudCJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhY2NvdW50In0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoic2VsZiIsInJlYWQiOiJzZWxmIn19XSwibmFtZSI6Im9kYiIsImlhdCI6MTYxMTA2ODY4MH0.jP4sPkYUl1Rrux-yfBU7ItTwHWDGFid0lU9RVR1H5gw';
  const middleware = new ExpressAuthenticationMiddleware(new DecodeIdentityStub() as DecodeIdentity);
  const next: NextFunction = () => true;
  const res = ({ body: {}, sendStatus: () => true } as unknown) as Response;

  const errorRes = ({
    body: {},
    status: (code: number) => ({ send: (e: DomainError) => ({ status: code, body: { ...e } }) }),
  } as unknown) as Response;
  const decodeIdentityStub = new DecodeIdentityStub();
  decodeIdentityStub.execute = () => Promise.reject(new AuthErrors.IllegalIdentity('TOKEN_EXPIRED'));
  const middlewareWithError = new ExpressAuthenticationMiddleware(decodeIdentityStub as DecodeIdentity);
  const expiredUserToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMi0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjEyMjYzMDg2LCJuYmYiOjE2MTIyNjMwODYsImV4cCI6MTUxMzEzMDMxMSwiYWlvIjoiRTJaZ1lDamJaTCs5OUxhK2VkOW5WK1BIbFJiOUFBPT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInN1YiI6IjZmYWRlNTBmLWVmMjMtNDJmNi1iM2U4LWFiMmY5YjEwN2Y4NiIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OSIsInV0aSI6InozSmtndktYMjBld1lQZ2ZSbEl2QUEiLCJ2ZXIiOiIxLjAifQ.LJe1yuB7mVGPT5hLxq8s9J18wGJuueIWfbmHbpE9PXA';

  it('Should return the IP address based on X-Forwarded-For header', async () => {
    const req = ({ headers: { authorization: `Bearer ${userToken}` } } as unknown) as Request & {
      user: Identity;
    };
    req.headers['x-forwarded-for'] =
      '147.243.192.8, ::FFFF:172.16.146.1, ::FFFF:147.243.192.8:43407, [fde4:8dba:1200:98db:6a12:300:a02:126]:27842';
    await middleware.use(req, res, next);
    expect(req.user.ipAddress).toEqual('147.243.192.8');
  });

  it('Should return the IP address based on X-Forwarded-For header with port', async () => {
    const req = ({ headers: { authorization: `Bearer ${userToken}` } } as unknown) as Request & {
      user: Identity;
    };
    req.headers['x-forwarded-for'] =
      '172.16.146.12:43407, ::FFFF:172.16.146.1, ::FFFF:147.243.192.8:43407, [fde4:8dba:1200:98db:6a12:300:a02:126]:27842';
    await middleware.use(req, res, next);
    expect(req.user.ipAddress).toEqual('172.16.146.12');
  });

  it('Should return the IP address based on IP header', async () => {
    const req = ({ headers: { authorization: `Bearer ${userToken}` } } as unknown) as Request & {
      user: Identity;
    };
    req.ip = '::FFFF:172.16.150.5';
    await middleware.use(req, res, next);
    expect(req.user.ipAddress).toEqual('172.16.150.5');
  });

  it('Should not return an ip if no req.ip or req.headers[X-Forwarded-For]', async () => {
    const req = ({ headers: { authorization: `Bearer ${userToken}` } } as unknown) as Request & {
      user: Identity;
    };
    await middleware.use(req, res, next);
    expect(req.user.ipAddress).not.toBeDefined();
  });

  it('Should not return an ip no ip is generic IPv6', async () => {
    const req = ({ headers: { authorization: `Bearer ${userToken}` } } as unknown) as Request & {
      user: Identity;
    };
    req.headers['x-forwarded-for'] =
      'fde4:8dba:1200:98db:6a12:300:a02:126, 147.243.192.8:43407, [fde4:8dba:1200:98db:6a12:300:a02:126]:27842';
    await middleware.use(req, res, next);
    expect(req.user.ipAddress).not.toBeDefined();
  });

  it('Should return 498 because expired user token', async () => {
    const req = ({ headers: { authorization: `Bearer ${expiredUserToken}` } } as unknown) as Request & {
      user: Identity;
    };
    req.headers['x-forwarded-for'] =
      '147.243.192.8, ::FFFF:172.16.146.1, ::FFFF:147.243.192.8:43407, [fde4:8dba:1200:98db:6a12:300:a02:126]:27842';
    const result = await middlewareWithError.use(req, errorRes, next);
    expect((result as any).status).toBe(498);
    expect((result as any).body).toMatchObject({
      cause: undefined,
      message: 'TOKEN_EXPIRED',
      name: 'IllegalIdentity',
    });
  });
});
