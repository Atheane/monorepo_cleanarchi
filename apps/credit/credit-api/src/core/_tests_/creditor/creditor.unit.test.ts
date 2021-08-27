import 'reflect-metadata';
import {
  X3X4EligibilityCalculatedHandler,
  BankAccountCreatedHandler,
  IAppConfiguration,
  CreateCreditor,
  UpdateCreditor,
  CreditorError,
} from '@oney/credit-core';
import * as path from 'path';
import { initializeKernel } from '../fixtures/initializeKernel';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { DomainDependencies, Kernel } from '../../di';
import { loadingEnvironmentConfig } from '../../../config/env/EnvConfigurationService';
import { bankAccountCreatedMessage } from '../fixtures/BankAccountCreatedMessage';
import { eligibilityAnalysedMessage } from '../fixtures/EligibilityAnalysedMessage';

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

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Create Creditor', () => {
  const userId = 'OsYFhvKAT';
  let dependencies: DomainDependencies;
  let kernel: Kernel;
  let configuration: IAppConfiguration;

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);
    configuration = getAppConfiguration();
    kernel = await initializeKernel(true, configuration);
    dependencies = kernel.getDependencies();
  });

  it('should create Creditor', async () => {
    const creditor = await dependencies.createCreditor.execute({
      userId,
      isEligible: true,
    });
    expect(creditor.props).toEqual({
      userId,
      isEligible: true,
    });
  });

  it('should throw Creditor already exists', async () => {
    const creditorCreated = await dependencies.createCreditor.execute({
      userId: 'bnlkjkt',
      isEligible: false,
    });
    const creditor = dependencies.createCreditor.execute({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
    expect(creditor).rejects.toThrow(CreditorError.AlreadyExists);
  });

  it('should handle BANK_ACCOUNT_CREATED', async () => {
    const createCreditor = kernel.get(CreateCreditor);

    const bankAccountCreatedHandler = new BankAccountCreatedHandler(createCreditor);

    const spy = jest.spyOn(bankAccountCreatedHandler, 'handle');

    await bankAccountCreatedHandler.handle(bankAccountCreatedMessage);
    expect(spy).toHaveBeenCalledWith(bankAccountCreatedMessage);
  });

  it('should update Creditor', async () => {
    const creditorCreated = await dependencies.createCreditor.execute({
      userId: 'bgoiyfxwer',
      isEligible: false,
    });
    const creditorUpdated = await dependencies.updateCreditor.execute({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
    expect(creditorUpdated.props).toEqual({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
  });

  it('should create a new creditor if it does not exist on updateCreditor call', async () => {
    const creditor = await dependencies.updateCreditor.execute({
      userId: 'jguygfutidt',
      isEligible: false,
    });
    expect(creditor.props).toMatchObject({
      userId: 'jguygfutidt',
      isEligible: false,
    });
  });

  it('should handle X3X4_ELIGIBILITY_CALCULATED', async () => {
    const updateCreditor = kernel.get(UpdateCreditor);

    const eligibilityAnalysedHandler = new X3X4EligibilityCalculatedHandler(updateCreditor);

    const spy = jest.spyOn(eligibilityAnalysedHandler, 'handle');

    await eligibilityAnalysedHandler.handle(eligibilityAnalysedMessage);
    expect(spy).toHaveBeenCalledWith(eligibilityAnalysedMessage);
  });

  it('should get a creditor', async () => {
    const creditorCreated = await dependencies.createCreditor.execute({
      userId: 'azehcutd',
      isEligible: true,
    });
    const creditorRequested = await dependencies.getCreditor.execute({
      uid: creditorCreated.props.userId,
    });
    expect(creditorRequested.props).toEqual({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
  });
});
