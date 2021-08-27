import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import {
  CustomerSituations,
  GetCustomerSituations,
  Identifiers,
  InternalIncidents,
  ProfileRepositoryRead,
  Situation,
} from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import { customerSituationsUpdatedDomainEvent } from './fixtures/customerSituations/customerSituationsUpdated.fixtures';
import { OneyB2BCustomerResponseMapper } from '../adapters/mappers/OneyB2BCustomerResponseMapper';

const container = new Container();

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

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

describe('GetCustomerSituations unit testing', () => {
  const uid = 'beGe_flCm';

  const situation: Situation = {
    lead: false,
    vip: false,
    staff: false,
  };

  let getCustomerSituations: GetCustomerSituations;
  let profileRepositoryRead: ProfileRepositoryRead;

  let saveFixture: Function;
  let mockBusSend: jest.Mock;
  let mockedCustomerSituations: CustomerSituations;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;

    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const profileDb = container.get(ProfileGenerator);
    getCustomerSituations = container.get<GetCustomerSituations>(Identifiers.getCustomerSituations);
    profileRepositoryRead = container.get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead);
    await profileDb.addSituation(uid, situation);

    mockedCustomerSituations = new OneyB2BCustomerResponseMapper().toDomain({
      customer_flag: '0',
      internal_incidents: {
        store_credit_limit_blocked_flag: '0',
        vplus_credit_limit_blocked_flag: '0',
        reconfiguration_flag: '0',
        indebtedness_flag: '0',
      },
    });

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/customerSituations`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    mockBusSend.mockClear();
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    MockDate.reset();
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should update the profile situation lead', async () => {
    await getCustomerSituations.execute({
      uid,
    });

    const updatedProfile = await profileRepositoryRead.getUserById(uid);

    expect(updatedProfile.props.situation.lead).toEqual(mockedCustomerSituations.lead);
  });

  it('Should get the profile with the customer situations', async () => {
    const profile = await getCustomerSituations.execute({
      uid,
    });

    expect(profile.props.situation.lead).toEqual(mockedCustomerSituations.lead);
  });

  it('Should dispatch CustomerSituationsUpdated through GetCustomerSituations use case', async () => {
    await getCustomerSituations.execute({
      uid,
    });

    expect(mockBusSend).toHaveBeenCalledWith(customerSituationsUpdatedDomainEvent);
  });

  it('Should map Oney France response to the customerSituations model', () => {
    const expectedCustomerSituations = new CustomerSituations({
      lead: false,
      internalIncidents: new InternalIncidents({
        worseUnpaidStage: '0',
        worseHouseholdFunctioningStatusCode: 1,
        worseHouseholdFunctioningStatusCodeLastUpdate: new Date('2018-07-03'),
        storeCreditLimitBlocked: false,
        storeCreditLimitBlockReason: 'DEP',
        oneyVplusCreditLimitBlocked: false,
        oneyVplusCreditLimitBlockReason: 'DEP',
        debtRestructured: false,
        overIndebted: false,
        amicableExitDate: new Date('2020-01-01'),
      }),
      creditAccountsSituation: {
        totalOutstandingCredit: 4839.41,
      },
    });

    const customerSituations = new OneyB2BCustomerResponseMapper().toDomain({
      customer_flag: '1',
      internal_incidents: {
        worse_unpaid_stage: '0',
        worse_household_functioning_status_code: '1',
        last_worse_household_functioning_status_code_update_date: '2018-07-03',
        store_credit_limit_blocked_flag: '0',
        store_credit_limit_blocked_reason: 'DEP',
        vplus_credit_limit_blocked_flag: '0',
        vplus_credit_limit_blocked_reason: 'DEP',
        reconfiguration_flag: '0',
        indebtedness_flag: '0',
        ended_amicable_collecting_date: '2020-01-01',
      },
      credit_accounts_situation: {
        total_outstanding_amount: '4839.41',
      },
    });

    expect(customerSituations).toEqual(expectedCustomerSituations);
  });

  it('Should map Oney France response to the customerSituations model', () => {
    const expectedCustomerSituations = new CustomerSituations({
      lead: false,
      internalIncidents: new InternalIncidents({
        worseUnpaidStage: '0',
        worseHouseholdFunctioningStatusCode: 1,
        worseHouseholdFunctioningStatusCodeLastUpdate: new Date('2018-07-03'),
        storeCreditLimitBlocked: false,
        storeCreditLimitBlockReason: 'DEP',
        oneyVplusCreditLimitBlocked: false,
        oneyVplusCreditLimitBlockReason: 'DEP',
        debtRestructured: false,
        overIndebted: false,
        amicableExitDate: new Date('2020-01-01'),
      }),
      creditAccountsSituation: {
        totalOutstandingCredit: 4839.41,
      },
    });

    const customerSituations = new OneyB2BCustomerResponseMapper().toDomain({
      customer_flag: '1',
      internal_incidents: {
        worse_unpaid_stage: '0',
        worse_household_functioning_status_code: '1',
        last_worse_household_functioning_status_code_update_date: '2018-07-03',
        store_credit_limit_blocked_flag: '0',
        store_credit_limit_blocked_reason: 'DEP',
        vplus_credit_limit_blocked_flag: '0',
        vplus_credit_limit_blocked_reason: 'DEP',
        reconfiguration_flag: '0',
        indebtedness_flag: '0',
        ended_amicable_collecting_date: '2020-01-01',
      },
      credit_accounts_situation: {
        total_outstanding_amount: '4839.41',
      },
    });

    expect(customerSituations).toEqual(expectedCustomerSituations);
  });
});
