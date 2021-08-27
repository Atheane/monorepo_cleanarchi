import { ConfigService } from '@oney/envs';
import { P2pProperties } from '@oney/pfm-core';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { getEventModel } from '../../adapters/mongodb/models/BudgetInsight';
import { seedEvents } from '../fixtures/transactions/seedEvents';
import { setupKernel } from '../fixtures/config/config.kernel';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { testConfiguration } from '../fixtures/config/config';
import { getAccountStatementModel, getP2pModel } from '../../adapters/mongodb/models';

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('P2P Testing', () => {
  let dependencies: DomainDependencies;
  beforeAll(async () => {
    await new ConfigService({ localUri: envPath }).loadEnv();
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    const kernel = await setupKernel(testConfiguration, false, dbConnection);
    await kernel.initIdentityLib();
    kernel.initBlobStorage();
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    await getEventModel().deleteMany({});
    await getP2pModel().deleteMany({});
    await getAccountStatementModel().deleteMany({});
    await getEventModel().insertMany(seedEvents);
  });

  it('should save a p2p without recurrence', async () => {
    const p2pCreated: P2pProperties = {
      beneficiary: {
        id: '992',
        uid: '1234567',
        iban: 'FR0210096000703929893933L43',
        fullname: 'Testvirement',
      },
      sender: {
        id: '1388',
        uid: '1234567',
        iban: 'FR8112869000020PC0000012K39',
        fullname: 'Corinne Berthier',
      },
      date: new Date('2020-10-01T08:23:13.512Z'),
      amount: 100,
      message: 'p2p_message',
      orderId: 'abc',
      tag: {
        generateUnpaid: false,
        verifyLimits: false,
        generatedTag: 'VIRT ENTRE CPT CLT',
      },
    };

    const savedP2p = await dependencies.createP2p.execute({ p2pCreated });

    expect(savedP2p.props).toMatchObject({
      amount: 100,
      beneficiary: {
        id: '992',
        uid: '1234567',
        iban: 'FR0210096000703929893933L43',
        fullname: 'Testvirement',
      },
      message: 'p2p_message',
      orderId: 'abc',
      sender: {
        id: '1388',
        uid: '1234567',
        iban: 'FR8112869000020PC0000012K39',
        fullname: 'Corinne Berthier',
      },
      tag: {
        generateUnpaid: false,
        verifyLimits: false,
        generatedTag: 'VIRT ENTRE CPT CLT',
      },
    });
  });

  it('should save a p2p with recurrence', async () => {
    const p2pCreated: P2pProperties = {
      beneficiary: {
        id: '992',
        iban: 'FR0210096000703929893933L43',
        fullname: 'Testvirement',
      },
      sender: {
        id: '1388',
        iban: 'FR8112869000020PC0000012K39',
        fullname: 'Corinne Berthier',
      },
      date: new Date('2020-10-01T08:23:13.512Z'),
      amount: 1000,
      message: 'p2p_message',
      orderId: 'abc',
      tag: {
        generateUnpaid: false,
        verifyLimits: false,
        generatedTag: 'VIRT ENTRE CPT CLT',
      },
      recurrence: {
        endRecurrency: new Date('2020-10-01T08:23:13.512Z'),
        frequencyType: 0,
        recurrentDays: 7,
      },
    };

    const savedP2p = await dependencies.createP2p.execute({ p2pCreated });

    expect(savedP2p.props).toMatchObject({
      amount: 1000,
      beneficiary: {
        id: '992',
        iban: 'FR0210096000703929893933L43',
        fullname: 'Testvirement',
      },
      message: 'p2p_message',
      orderId: 'abc',
      recurrence: {
        endRecurrency: new Date('2020-10-01T08:23:13.512Z'),
        frequencyType: 0,
        recurrentDays: 7,
      },
      sender: {
        id: '1388',
        iban: 'FR8112869000020PC0000012K39',
        fullname: 'Corinne Berthier',
      },
      tag: {
        generateUnpaid: false,
        verifyLimits: false,
        generatedTag: 'VIRT ENTRE CPT CLT',
      },
    });
  });
});
