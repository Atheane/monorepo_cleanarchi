/* eslint-env jest */
import * as dateMock from 'jest-date-mock';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { initMongooseConnection } from '@oney/common-adapters';
import * as path from 'path';
import { DomainDependencies, Kernel } from '../../src/di';
import { testConfiguration } from '../fixtures/config/config';
import { paymentSchedules } from '../fixtures/paymentSchedules';
import { processPaymentScheduleResult } from '../fixtures/processPaymentScheduleResult';
import { SplitPaymentSchedule } from '../../../core/src/domain/entities/SplitPaymentSchedule';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
nockBack.setMode('record');

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
    }),
  },
}));
describe('Process payment integration testing', () => {
  let dependencies: DomainDependencies;
  beforeAll(async () => {
    const config = testConfiguration;
    config.mongoURI = process.env.MONGO_URL;
    const kernel = new Kernel(false, config);
    kernel.initDependencies();
    await initMongooseConnection(process.env.MONGO_URL);
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
    await Promise.all(
      paymentSchedules.map(paymentSchedule =>
        dependencies.splitPaymentScheduleRepository.save(new SplitPaymentSchedule(paymentSchedule)),
      ),
    );
  });

  afterEach(async () => {
    await mongoose.connection.close();
    nock.cleanAll();
    dateMock.clear();
  });

  it('should process payment Schedules for several Users', async () => {
    dateMock.advanceTo(new Date('1994-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json');

    await dependencies.processPayments.execute();
    const savedDocuments = await dependencies.splitPaymentScheduleRepository.getUpcomingSchedulesByUser();
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

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
