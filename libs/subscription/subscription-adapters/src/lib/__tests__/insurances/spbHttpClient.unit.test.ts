/**
 * @jest-environment node
 */
import 'reflect-metadata';
import * as nock from 'nock';
import { describe } from '@jest/globals';
import { TokenType } from '@oney/common-core';
import { NodeCacheGateway } from '@oney/common-adapters';
import * as NodeCache from 'node-cache';
import * as path from 'path';
import { SPBConfig } from './fixtures/insurance/createMembershipInsurance';
import { initSPBHttpClient } from '../../adapters/partners/spb/initSPBHttpClient';

describe('UNIT - SetupSPBConnection', () => {
  let cacheProvider: NodeCacheGateway;
  let saveFixture: Function;
  beforeEach(async () => {
    cacheProvider = new NodeCacheGateway(new NodeCache({ checkperiod: 5 }));
    nock.restore();
    nock.activate();
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

  it('Should get a new token on expiration', async () => {
    await initSPBHttpClient(SPBConfig.spbApiConfiguration, cacheProvider);
    const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay));
    cacheProvider.setTtl(TokenType.ACCESS_TOKEN, 1);
    const updatedToken = cacheProvider.get(TokenType.ACCESS_TOKEN);

    // WHEN
    // Waiting for token to auto refresh
    await wait(15000);

    // THEN
    const newToken = cacheProvider.get(TokenType.ACCESS_TOKEN);
    expect(newToken.value).toBeDefined();
    expect(newToken.value).not.toBe(updatedToken.value);
  });

  it('Should keep expired token in cache and set a ttl=1 on refresh Access Token error', async () => {
    await initSPBHttpClient(SPBConfig.spbApiConfiguration, cacheProvider);
    const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay));

    // GIVEN
    const oldToken = cacheProvider.get(TokenType.ACCESS_TOKEN);
    expect(oldToken.value).toBeDefined();
    expect(oldToken.ttl).toBeGreaterThan(0);
    cacheProvider.setTtl(TokenType.ACCESS_TOKEN, 1);
    await wait(10000);

    // THEN
    expect(cacheProvider.get(TokenType.ACCESS_TOKEN).value).toBe(oldToken.value);
    // In this case we force the expiration, so the old TTl should always be less than the new one (which is 1s)
    expect(cacheProvider.get(TokenType.ACCESS_TOKEN).ttl).toBeLessThan(oldToken.ttl);
  });
});
