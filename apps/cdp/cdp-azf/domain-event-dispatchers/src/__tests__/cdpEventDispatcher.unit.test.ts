import 'reflect-metadata';
import { EventProducerDispatcher } from '@oney/messages-core';
import { CdpEventName } from '@oney/cdp-messages';
import { testConfiguration } from './fixtures/configTest';
import { x3X4EligibilityPayload } from './fixtures/X3X4EligibilityPayload';
import { accountEligibilityPayload } from './fixtures/accountEligibilityPayload';
import { preEligibilityPayload } from './fixtures/preEligibilityPayload';
import { CdpKernel } from '../config/di/CdpKernel';
import { ValidCdpEventName } from '../core/domain/valueobjects';
import { CdpEventError } from '../core/domain/models';
import { customBalanceLimitPayload } from './fixtures/customBalanceLimitPayload';
import { aggregateAccountsIncomesPayload } from './fixtures/aggregateAccountsIncomesPayload';
import {
  DispatchAccountEligibility,
  DispatchAggregatedAccountsIncomes,
  DispatchCustomBalanceLimit,
  DispatchPreEligibility,
  DispatchX3X4Eligibility,
} from '../core/usecases';

jest.mock('@azure/service-bus', () => {
  return {
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
      }),
    },
  };
});

describe('CDP events to DomainEvents unit tests', () => {
  let kernel: CdpKernel;
  let dispatchX3X4Eligibility: DispatchX3X4Eligibility;
  let dispatchAccountEligibility: DispatchAccountEligibility;
  let dispatchPreEligibility: DispatchPreEligibility;
  let dispatchCustomBalanceLimit: DispatchCustomBalanceLimit;
  let dispatchAggregatedAccountsIncomes: DispatchAggregatedAccountsIncomes;

  beforeAll(async () => {
    const config = testConfiguration;
    kernel = new CdpKernel(config).initDependencies();

    dispatchX3X4Eligibility = kernel.get(DispatchX3X4Eligibility);
    dispatchAccountEligibility = kernel.get(DispatchAccountEligibility);
    dispatchPreEligibility = kernel.get(DispatchPreEligibility);
    dispatchCustomBalanceLimit = kernel.get(DispatchCustomBalanceLimit);
    dispatchAggregatedAccountsIncomes = kernel.get(DispatchAggregatedAccountsIncomes);
  });

  beforeEach(async done => {
    await done();
  });

  afterEach(async done => {
    await done();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should dispatch X3X4_ELIGIBILITY_CALCULATED', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    await dispatchX3X4Eligibility.execute(x3X4EligibilityPayload);

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: [],
        id: x3X4EligibilityPayload.uId,
        props: {
          userId: x3X4EligibilityPayload.uId,
          X3X4Eligibility: {
            uId: x3X4EligibilityPayload.uId,
            eligibility: x3X4EligibilityPayload.eligibility,
          },
        },
      }),
    );
  });

  it('should dispatch ACCOUNT_ELIGIBILITY_CALCULATED', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    await dispatchAccountEligibility.execute(accountEligibilityPayload);

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: accountEligibilityPayload.uId,
        props: {
          userId: accountEligibilityPayload.uId,
          accountEligibility: {
            uId: accountEligibilityPayload.uId,
            eligibility: accountEligibilityPayload.eligibility,
            timestamp: new Date(accountEligibilityPayload.timestamp),
            balanceLimit: accountEligibilityPayload.balanceLimit,
          },
        },
      }),
    );
  });

  it('should dispatch PRE_ELIGIBILITY_OK', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    await dispatchPreEligibility.execute(preEligibilityPayload);

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: preEligibilityPayload.uId,
        props: {
          userId: preEligibilityPayload.uId,
          preEligibilityOK: {
            uId: preEligibilityPayload.uId,
            timestamp: new Date(preEligibilityPayload.timestamp),
          },
        },
      }),
    );
  });

  it('should dispatch CUSTOM_BALANCE_LIMIT_CALCULATED', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    await dispatchCustomBalanceLimit.execute(customBalanceLimitPayload);

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: customBalanceLimitPayload.uId,
        props: {
          userId: customBalanceLimitPayload.uId,
          customBalanceLimit: {
            uId: customBalanceLimitPayload.uId,
            customBalanceLimit: customBalanceLimitPayload.customBalanceLimit,
            verifiedRevenues: customBalanceLimitPayload.verifiedRevenues,
            customBalanceLimitEligibility: customBalanceLimitPayload.eligibility,
          },
        },
      }),
    );
  });

  it('should dispatch AGGREGATED_ACCOUNTS_INCOMES_CHECKED', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    await dispatchAggregatedAccountsIncomes.execute(aggregateAccountsIncomesPayload);

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: aggregateAccountsIncomesPayload.uId,
        props: {
          userId: aggregateAccountsIncomesPayload.uId,
          aggregatedAccountsIncomes: {
            uid: aggregateAccountsIncomesPayload.uId,
            verifications: [
              {
                accountAggregatedId:
                  aggregateAccountsIncomesPayload.possibleRevenuesDetected[0].accountAggregatedId,
                valid: aggregateAccountsIncomesPayload.possibleRevenuesDetected[0].valid,
              },
            ],
          },
        },
      }),
    );
  });

  it('should return a payload with a valid event name', async () => {
    const cdpRawPayload = new ValidCdpEventName({
      uId: 'uId',
      timestamp: 'timestamp',
      title: CdpEventName.X3X4_ELIGIBILITY_CALCULATED,
      eligibility: true,
      productCode: 'azeaze',
      productLabel: 'opuoiuy',
    }).value;
    expect(cdpRawPayload).toBeTruthy();
  });

  it('should throw MissingEventName', async () => {
    const validation = () => {
      /* eslint-disable-next-line */ // cause invalid payload has a tyscript type error and we want to test how invalid payload are handled
      // @ts-ignore
      return new ValidCdpEventName({
        uId: 'uId',
        timestamp: 'timestamp',
        eligibility: true,
        productCode: 'azeaze',
        productLabel: 'opuoiuy',
      }).value;
    };
    expect(validation).toThrow(CdpEventError.MissingEventName);
  });

  it('should throw EventNotImplemented', async () => {
    const validation = () =>
      new ValidCdpEventName({
        uId: 'uId',
        timestamp: 'timestamp',
        title: 'unknown event name',
        eligibility: true,
        productCode: 'azeaze',
        productLabel: 'opuoiuy',
      }).value;
    expect(validation).toThrow(CdpEventError.EventNotImplemented);
  });

  it('should throw InvalidPayload if eligibility is missing in X3X4EligibilityPayload', async () => {
    const invalidX3X4EligibilityPayload = {
      ...x3X4EligibilityPayload,
    };
    delete invalidX3X4EligibilityPayload.eligibility;

    const result = dispatchX3X4Eligibility.execute(invalidX3X4EligibilityPayload);
    await expect(result).rejects.toThrow(CdpEventError.InvalidPayload);
  });

  it('should throw InvalidPayload if eligibility is missing in accountEligibilityPayload', async () => {
    const invalidAccountPayload = {
      ...accountEligibilityPayload,
    };
    delete invalidAccountPayload.eligibility;

    const result = dispatchAccountEligibility.execute(invalidAccountPayload);
    await expect(result).rejects.toThrow(CdpEventError.InvalidPayload);
  });

  it('should throw InvalidPayload if uId is missing in preEligibilityPayload', async () => {
    const invalidPreEligibilityPayload = {
      ...preEligibilityPayload,
    };
    delete invalidPreEligibilityPayload.uId;

    const result = dispatchPreEligibility.execute(invalidPreEligibilityPayload);
    await expect(result).rejects.toThrow(CdpEventError.InvalidPayload);
  });

  it('should throw InvalidPayload if uId is missing in customBalanceLimitPayload', async () => {
    const invalidCustomBalanceLimitPayload = {
      ...customBalanceLimitPayload,
    };
    delete invalidCustomBalanceLimitPayload.customBalanceLimit;

    const result = dispatchCustomBalanceLimit.execute(invalidCustomBalanceLimitPayload);
    await expect(result).rejects.toThrow(CdpEventError.InvalidPayload);
  });

  it('should throw InvalidPayload if uId is missing in aggregateAccountsIncomesPayload', async () => {
    const invalidAggregateAccountsIncomesPayload = {
      ...aggregateAccountsIncomesPayload,
    };
    delete invalidAggregateAccountsIncomesPayload.possibleRevenuesDetected;

    const result = dispatchAggregatedAccountsIncomes.execute(invalidAggregateAccountsIncomesPayload);
    await expect(result).rejects.toThrow(CdpEventError.InvalidPayload);
  });
});
