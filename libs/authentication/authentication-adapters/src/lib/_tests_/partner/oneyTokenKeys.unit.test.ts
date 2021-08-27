import 'reflect-metadata';
import { DomainDependencies } from '@oney/authentication-core';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';

describe('OneyTokenKeys usecases unit testing', () => {
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    kernel = (await initializeInMemoryAuthenticationBuildDependencies()).kernel;

    dependencies = kernel.getDependencies();
  });

  it('Should return the oney public key', async () => {
    const result = await dependencies.oneyTokenKeys.execute();

    expect(result).toEqual([
      {
        kid: 'fakeKid',
        alg: 'RS256',
        kty: 'RSA',
        use: 'sig',
        n: 'fakeModulus',
        e: 'fakeExponent',
      },
    ]);
  });
});
