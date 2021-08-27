/* eslint-env jest */
import 'reflect-metadata';

import { CallbackType, KycDecisionType, UpdateProfileLcbFt } from '@oney/profile-core';
import { Container } from 'inversify';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from './fixtures/config';
import { ProfileGenerator } from './fixtures/tips/ProfileGenerator';
import {
  moneyLaunderingRiskHighDomainEvent,
  moneyLaunderingRiskLowActiveDomainEvent,
  moneyLaunderingRiskLowPendingDomainEvent,
  moneyLaunderingRiskMediumDomainEvent,
  updatedActionRequiredActivateStatusDomainEvent,
  updatedOnHoldStatusDomainEvent,
} from './fixtures/updateLcbFt/events';
import { buildProfileAdapterLib } from '../adapters/build';

const container = new Container();

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

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

//TODO review this tests
describe('Process lcb ft callback unit testing', () => {
  let updateLcbFt: UpdateProfileLcbFt;
  let profileDb: ProfileGenerator;
  const uid = 'xWr-VutjI';
  let mockBusSend: jest.Mock;
  const message = {
    type: CallbackType.LCB_FT,
    appUserId: uid,
    riskLevel: LcbFtRiskLevel.HIGH,
    eventDate: '2020-07-03T22:00:00+00:00',
  };

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);

    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileDb = container.get(ProfileGenerator);
    updateLcbFt = container.get(UpdateProfileLcbFt);
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
  });

  beforeEach(async () => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
    await profileDb.generate(uid, ProfileStatus.ON_BOARDING, 'caseReference', KycDecisionType.OK_MANUAL);
    await profileDb.generate(
      'pendingUser',
      ProfileStatus.ON_HOLD,
      'caseReference',
      KycDecisionType.PENDING_REVIEW,
    );
    await profileDb.generate('active', ProfileStatus.ACTIVE, 'caseReference', KycDecisionType.OK_MANUAL);
  });

  it('should update user when a message is dispatch on the bus by payment AZF', async () => {
    const result = await updateLcbFt.execute(message);
    expect(result.props.kyc.moneyLaunderingRisk).toEqual(message.riskLevel);
    // expect(result.props.informations.status).toEqual(Status.ON_HOLD);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, moneyLaunderingRiskHighDomainEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, updatedOnHoldStatusDomainEvent);
  });

  it('should update user and set status to checkEligibility', async () => {
    const result = await updateLcbFt.execute({
      ...message,
      riskLevel: LcbFtRiskLevel.MEDIUM,
    });
    expect(result.props.kyc.moneyLaunderingRisk).toEqual(LcbFtRiskLevel.MEDIUM);
    expect(result.props.informations.status).toEqual(ProfileStatus.CHECK_ELIGIBILITY);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, moneyLaunderingRiskMediumDomainEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, updatedActionRequiredActivateStatusDomainEvent);
  });

  it('should update user but not modify user status', async () => {
    const result = await updateLcbFt.execute({
      ...message,
      appUserId: 'pendingUser',
      riskLevel: LcbFtRiskLevel.LOW,
    });
    expect(result.props.kyc.moneyLaunderingRisk).toEqual(LcbFtRiskLevel.LOW);
    expect(result.props.informations.status).toEqual(ProfileStatus.CHECK_ELIGIBILITY);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, moneyLaunderingRiskLowPendingDomainEvent);
  });

  it('should update user but not modify user status and still be active', async () => {
    const result = await updateLcbFt.execute({
      ...message,
      appUserId: 'active',
      riskLevel: LcbFtRiskLevel.LOW,
    });
    expect(result.props.kyc.moneyLaunderingRisk).toEqual(LcbFtRiskLevel.LOW);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, moneyLaunderingRiskLowActiveDomainEvent);
  });
});
