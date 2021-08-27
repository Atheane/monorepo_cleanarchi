/**
 * @jest-environment node
 */
import 'reflect-metadata';
import * as nock from 'nock';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import { CreateMembershipInsurance, NetworkError, Subscription } from '@oney/subscription-core';
import * as path from 'path';
import {
  createMembershipCommand,
  mockedSubscription,
  SPBConfig,
  spbCreateMembershipRequest,
} from './fixtures/insurance/createMembershipInsurance';
import {
  cacheModule,
  initHttpClients,
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';
import { MembershipApi } from '../../adapters/partners/spb/api/MembershipApi';

const container = new Container();
const subscriptionStore = new Map<string, Subscription>();
describe('UNIT - CreateMembershipInsurance', () => {
  let spbCreateMembershipSpy: jest.SpyInstance;
  let spbActivateMembershipSpy: jest.SpyInstance;
  beforeAll(async () => {
    container.load(
      subscriptionModule,
      inMemorySubscriptionImplems({
        subscriberDb: new Map(),
        billDb: new Map(),
        subscriptionDb: subscriptionStore,
      }),
      inMemoryBusModule(container),
      cacheModule(),
    );
    await initHttpClients(container, SPBConfig);

    spbCreateMembershipSpy = jest.spyOn(MembershipApi.prototype, 'create');
    spbActivateMembershipSpy = jest.spyOn(MembershipApi.prototype, 'activate');
  });

  let saveFixture: Function;
  beforeEach(async () => {
    subscriptionStore.set(mockedSubscription.props.id, mockedSubscription);
    nock.restore();
    nock.activate();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/insurance`);
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

  afterEach(() => {
    subscriptionStore.clear();
  });

  it('Should Create Membership Insurance', async () => {
    // Http Clients init in here to use auto fixture feature
    await container.get(CreateMembershipInsurance).execute(createMembershipCommand);
    expect(spbCreateMembershipSpy).toBeCalledWith(spbCreateMembershipRequest);
    expect(spbActivateMembershipSpy).toBeCalledWith('000004680729');
    expect(subscriptionStore.get(mockedSubscription.props.id)).toEqual({
      ...mockedSubscription,
      props: {
        ...mockedSubscription.props,
        insuranceMembershipId: '000004680729',
      },
    });
  });

  it('Should reject with NetworkError', async () => {
    // Http Clients init in here to use auto fixture feature
    const error = new NetworkError.ApiResponseError('SPB_API_ERROR');
    const result = container.get(CreateMembershipInsurance).execute(createMembershipCommand);
    await expect(result).rejects.toThrowError(error);
  });
});
