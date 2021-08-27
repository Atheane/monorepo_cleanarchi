import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import * as path from 'path';
import { DomainDependencies, Kernel } from '../../src/di';
import { paymentSchedules } from '../fixtures/paymentSchedules';
import { contracts } from '../fixtures/contracts';
import { SplitContract, SplitContractError, SplitPaymentSchedule } from '../../../core/src/domain';
import { testConfiguration } from '../fixtures/config/config';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
nockBack.setMode('record');

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

describe('Close contracts unit testing', () => {
  let dependencies: DomainDependencies;
  beforeAll(() => {
    const config = testConfiguration;
    const kernel = new Kernel(true, config);
    kernel.initDependencies();
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    dateMock.clear();
    nock.cleanAll();
    await Promise.all(
      contracts.map(contract => dependencies.splitContractRepository.save(new SplitContract(contract))),
    );
    await Promise.all(
      paymentSchedules.map(paymentSchedule =>
        dependencies.splitPaymentScheduleRepository.save(new SplitPaymentSchedule(paymentSchedule)),
      ),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should close contracts if all payments are paid', async () => {
    const { nockDone } = await nockBack('closeContracts.json');
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    await dependencies.processPayments.execute();
    dateMock.advanceTo(new Date('1994-06-21T00:00:00.000Z'));
    await dependencies.processPayments.execute();
    dateMock.advanceTo(new Date('1994-07-21T00:00:00.000Z'));
    await dependencies.processPayments.execute();
    dateMock.advanceTo(new Date('1994-08-21T00:00:00.000Z'));
    await dependencies.closePaidContracts.execute();
    const remainingSchedules = await dependencies.splitPaymentScheduleRepository.getUpcomingSchedulesByUser();
    // two schedules were deleted, remaining the last one in fixture
    expect(remainingSchedules.length).toEqual(1);
    const { props: contract } = await dependencies.splitContractRepository.getByContractNumber(
      contracts[0].contractNumber,
    );
    expect(contract).toEqual(
      expect.objectContaining({
        contractNumber: 'azeaze',
        userId: 'K-oZktdWv',
        initialTransactionId: 'azeacabjshkj',
        productCode: 'DF003',
        subscriptionDate: new Date('1994-04-21T00:00:00.000Z'),
        apr: 0.1926,
        status: 'PAID',
        initialPaymentSchedule: {
          immediatePayments: [
            { key: 'fee', amount: 5.79, dueDate: new Date('1994-04-21T00:00:00.000Z') },
            { key: '001', amount: 133, dueDate: new Date('1994-04-21T00:00:00.000Z') },
          ],
          deferredPayments: [
            { key: '002', amount: 133, dueDate: new Date('1994-05-21T00:00:00.000Z') },
            { key: '003', amount: 133, dueDate: new Date('1994-06-21T00:00:00.000Z') },
          ],
        },
      }),
    );
    expect(contract.finalPaymentSchedule.props).toEqual({
      id: 'paymentScheduleId1',
      initialTransactionId: 'azeacabjshkj',
      bankAccountId: '1388',
      userId: 'K-oZktdWv',
      status: 'PAID',
      contractNumber: 'azeaze',
      productCode: 'DF003',
      fundingExecution: {
        key: 'funding',
        amount: 399,
        dueDate: new Date('1994-04-21T00:00:00.000Z'),
        status: 'PAID',
        transactionId: 'CDCEDE14204',
        paymentDate: new Date('1994-04-21T00:00:00.000Z'),
      },
      paymentsExecution: [
        {
          key: 'fee',
          amount: 5.79,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          status: 'PAID',
          transactionId: 'DDFEDE10232',
          paymentDate: new Date('1994-04-21T00:00:00.000Z'),
        },
        {
          key: '001',
          amount: 133,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          status: 'PAID',
          transactionId: 'BDDBFC13014',
          paymentDate: new Date('1994-04-21T00:00:00.000Z'),
        },
        {
          key: '002',
          amount: 133,
          dueDate: new Date('1994-05-21T00:00:00.000Z'),
          status: 'PAID',
          paymentDate: new Date('2020-10-23T21:10:33.043Z'),
          transactionId: 'EFFEBA21320',
        },
        {
          key: '003',
          amount: 133,
          dueDate: new Date('1994-06-21T00:00:00.000Z'),
          status: 'PAID',
          paymentDate: new Date('2020-10-23T21:10:49.581Z'),
          transactionId: 'DEDCDD00101',
        },
      ],
    });

    nockDone();
  });

  it('should throw a contract not found error', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    const result = dependencies.splitContractRepository.getByContractNumber('tchatche');
    await expect(result).rejects.toThrow(SplitContractError.NotFound);
  });
});
