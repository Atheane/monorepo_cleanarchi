import 'reflect-metadata';
import { GenericError } from '@oney/common-core';
import { GetTips, TipsErrors, TipsServiceProviders } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from './fixtures/config';
import { ProfileGenerator } from './fixtures/tips/ProfileGenerator';
import { mockCdpTips } from './fixtures/tips/cdpTips';
import { buildProfileAdapterLib } from '../adapters/build';
import { onHoldHtml } from '../adapters/providers/odb/tips/templates/htmls/onHold';
import { actionRequiredActivateHtml } from '../adapters/providers/odb/tips/templates/htmls/actionRequiredActivateHtml';

jest.mock('@azure/service-bus', () => ({
  ReceiveMode: {
    peekLock: 1,
    receiveAndDelete: 2,
  },
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockReturnValue({
      createTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
          send: jest.fn(),
        }),
      }),
      createSubscriptionClient: jest.fn().mockReturnValue({
        createReceiver: jest.fn().mockReturnValue({
          registerMessageHandler: jest.fn(),
        }),
      }),
    }),
  },
}));

const container = new Container();

describe('Tips unit testing', function () {
  let getTips: GetTips;
  let scope: nock.Scope;

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    getTips = container.get(GetTips);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const tipsDb = container.get(ProfileGenerator);
    await tipsDb.generate('active', ProfileStatus.ACTIVE);
    await tipsDb.generate('onHold', ProfileStatus.ON_HOLD);
    await tipsDb.generate('required', ProfileStatus.ACTION_REQUIRED);
    await tipsDb.generate('requiredActivate', ProfileStatus.ACTION_REQUIRED_ACTIVATE);
    await tipsDb.generate('requiredTaxNotice', ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
    await tipsDb.generate('checkEligibility', ProfileStatus.CHECK_ELIGIBILITY);
    await tipsDb.generate('checkRequiredAml', ProfileStatus.CHECK_REQUIRED_AML);
    await tipsDb.generate('requiredId', ProfileStatus.ACTION_REQUIRED_ID);
    await tipsDb.generate('rejected', ProfileStatus.REJECTED);
    await tipsDb.generate('wrongStatus', 'WrongID' as ProfileStatus);
    await tipsDb.generate('oney4', ProfileStatus.ACTIVE);
  });

  it('Should return tips from cdp', async () => {
    scope = nock('https://lily-api.azure-api.net');
    scope.post('/recommendations/query-recommender').reply(200, mockCdpTips);
    const result = await getTips.execute({
      uid: 'oney4',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.cdp);
    expect(result.props.uid).toEqual(mockCdpTips.uid);
  });

  it("Should return error because CDP doesn't have any tips", async () => {
    scope = nock('https://lily-api.azure-api.net');
    scope.post('/recommendations/query-recommender').reply(200, {
      originalSourceId: '',
      erreur: "Ce userId n'existe pas et vient d'être créé. Merci de rafraichir [DEV/UAT]",
    });
    const result = getTips.execute({
      uid: 'active',
    });
    await expect(result).rejects.toThrow(TipsErrors.NoTipsForUser);
  });

  it('Should throw ApiResponseError when CDP returns 400', async () => {
    scope = nock('https://lily-api.azure-api.net');
    scope.post('/recommendations/query-recommender').reply(400);
    const result = getTips.execute({
      uid: 'active',
    });
    await expect(result).rejects.toThrow(GenericError.ApiResponseError);
  });

  it('Should return error case status not handle by odb provider', async () => {
    const result = getTips.execute({
      uid: 'wrongStatus',
    });
    await expect(result).rejects.toThrow(TipsErrors.IfCaseNotImplemented);
  });

  it('Should return tips hero onHold', async () => {
    const result = await getTips.execute({
      uid: 'onHold',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.details.rawHtml).toEqual(onHoldHtml);
  });

  it('Should return tips hero on action required', async () => {
    const result = await getTips.execute({
      uid: 'required',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.details.rawHtml).toEqual(onHoldHtml);
  });

  it('Should return tips hero on rejected', async () => {
    const result = await getTips.execute({
      uid: 'rejected',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.title).toEqual("Votre demande de création de compte n'a pu aboutir");
  });

  it('Should return tips hero on action required activate', async () => {
    const result = await getTips.execute({
      uid: 'requiredActivate',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.details.rawHtml).toEqual(actionRequiredActivateHtml);
  });

  it('Should return tips hero on action required ID', async () => {
    const result = await getTips.execute({
      uid: 'requiredId',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.redirectLink).toEqual('odb://odb/identity-document');
  });

  it('Should return tips hero on action required Tax Notice', async () => {
    const result = await getTips.execute({
      uid: 'requiredTaxNotice',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.title).toEqual("Merci de nous fournir votre dernier avis d'imposition");
    expect(result.props.redirectLink).toEqual('odb://odb/tax-notice');
  });

  it('Should return tips hero on CHECK_ELIGIBILITY', async () => {
    const result = await getTips.execute({
      uid: 'checkEligibility',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.details.rawHtml).toEqual(onHoldHtml);
  });

  it('Should return tips hero on CHECK_REQUIRED_AML', async () => {
    const result = await getTips.execute({
      uid: 'checkRequiredAml',
    });
    expect(result.props.provider).toEqual(TipsServiceProviders.odb);
    expect(result.props.details.rawHtml).toEqual(onHoldHtml);
  });
});
