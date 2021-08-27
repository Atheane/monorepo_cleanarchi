import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import * as path from 'path';
import { PaymentStatus } from '../../../core/src/domain/types';
import { DomainDependencies, Kernel } from '../../src/di';
import { testConfiguration } from '../fixtures/config/config';
import { failingPayments } from '../fixtures/failingPayments';
import { fundingTODOSchedulesPAID } from '../fixtures/fundingTODOSchedulesPAID';
import { paymentSchedules } from '../fixtures/paymentSchedules';
import { processPaymentScheduleResult } from '../fixtures/processPaymentScheduleResult';
import { SplitPaymentSchedule } from '../../../core/src/domain/entities';

const nockBack = nock.back;

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

describe('Process payment unit testing', () => {
  let dependencies: DomainDependencies;
  beforeAll(async () => {
    const config = testConfiguration;
    const kernel = new Kernel(true, config);
    kernel.initDependencies();
    dependencies = kernel.getDependencies();
    nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
  });

  beforeEach(async () => {
    await Promise.all(
      paymentSchedules.map(schedule => dependencies.splitPaymentScheduleRepository.delete(schedule.id)),
    );
    dateMock.clear();
    nockBack.setMode('record');
  });

  afterAll(async () => {
    jest.clearAllMocks();
    nock.restore();
  });

  afterEach(() => {
    nock.back.setMode('wild');
    nock.cleanAll();
  });

  it('should process payment Schedules for several Users', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    await Promise.all(
      paymentSchedules.map(paymentSchedule =>
        dependencies.splitPaymentScheduleRepository.save(new SplitPaymentSchedule(paymentSchedule)),
      ),
    );
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json');
    const savedDocuments = await dependencies.processPayments.execute();
    const flattenResult = savedDocuments.reduce(
      (documents, currentDocument) => documents.concat(currentDocument),
      [],
    );
    const splitSchedules = flattenResult.map(splitSchedule => splitSchedule.props);
    expect(splitSchedules).toEqual(
      expect.arrayContaining([expect.objectContaining(processPaymentScheduleResult[0])]),
    );

    expect(splitSchedules).toEqual(
      expect.arrayContaining([expect.objectContaining(processPaymentScheduleResult[1])]),
    );

    expect(splitSchedules).toEqual(
      expect.arrayContaining([expect.objectContaining(processPaymentScheduleResult[2])]),
    );
    nockDone();
  });

  it('should fail payment and return not update payment schedule', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('failedPayment.json');
    await dependencies.splitPaymentScheduleRepository.save(new SplitPaymentSchedule(failingPayments));
    const savedDocuments = await dependencies.processPayments.execute();
    const flattenResult = savedDocuments.reduce(
      (documents, currentDocument) => documents.concat(currentDocument),
      [],
    );
    const splitSchedules = flattenResult.map(splitSchedule => splitSchedule.props);

    expect(splitSchedules).toEqual(expect.arrayContaining([expect.objectContaining(failingPayments)]));
    nockDone();
  });

  it('should fail payment and return not update payment schedule (max retries)', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('failedPaymentMaxRetries.json');
    await dependencies.splitPaymentScheduleRepository.save(new SplitPaymentSchedule(failingPayments));
    const savedDocuments = await dependencies.processPayments.execute();
    const flattenResult = savedDocuments.reduce(
      (documents, currentDocument) => documents.concat(currentDocument),
      [],
    );
    const splitSchedules = flattenResult.map(splitSchedule => splitSchedule.props);

    expect(splitSchedules).toEqual(expect.arrayContaining([expect.objectContaining(failingPayments)]));
    nockDone();
  });

  it('should fail payment but not retry and return not update payment schedule', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('failedPaymentToManyRequest.json');
    await dependencies.splitPaymentScheduleRepository.save(new SplitPaymentSchedule(failingPayments));
    const savedDocuments = await dependencies.processPayments.execute();
    const flattenResult = savedDocuments.reduce(
      (documents, currentDocument) => documents.concat(currentDocument),
      [],
    );
    const splitSchedules = flattenResult.map(splitSchedule => splitSchedule.props);

    expect(splitSchedules).toEqual(expect.arrayContaining([expect.objectContaining(failingPayments)]));
    nockDone();
  });

  it('should proceed to funding payment only (coverage)', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('fundingOnlyPayment.json');
    await dependencies.splitPaymentScheduleRepository.save(
      new SplitPaymentSchedule(fundingTODOSchedulesPAID),
    );
    const savedDocuments = await dependencies.processPayments.execute();
    const flattenResult = savedDocuments.reduce(
      (documents, currentDocument) => documents.concat(currentDocument),
      [],
    );
    const splitSchedules = flattenResult.map(splitSchedule => splitSchedule.props);
    expect(splitSchedules[0].fundingExecution.status).toEqual(PaymentStatus.PAID);
    nockDone();
  });

  it('should not find any schedule', async () => {
    dateMock.advanceTo(new Date());
    const result = await dependencies.processPayments.execute();
    expect(result).toEqual([]);
  });
});
