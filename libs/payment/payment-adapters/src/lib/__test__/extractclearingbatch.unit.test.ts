/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { PaymentKernel } from '@oney/payment-adapters';
import { ExtractClearingBatch } from '@oney/payment-core';
import { ClearingBatchReceived } from '@oney/payment-messages';
import { defaultLogger } from '@oney/logger-adapters';
import * as path from 'path';
import { configuration, kvConfiguration } from './fixtures/config/Configuration';
import { dispatchedClearingEvents } from './fixtures/extractClearingBatch/busFixtures';
import { ClearingBatchReceivedEventHandler } from '../adapters/handlers/operation/ClearingBatchReceivedEventHandler';

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'kyc/toto.jpg',
          },
        ]),
        getBlobClient: jest.fn().mockReturnValue({
          download: jest.fn().mockReturnValue({
            readableStreamBody: new Uint8Array(Buffer.from('')),
          }),
        }),
      }),
    }),
  },
}));

describe('ExtractClearingBatch unit testing', () => {
  let kernel: PaymentKernel;
  let extractClearingBatch: ExtractClearingBatch;
  let saveFixture: Function;
  let spyOn_dispatch;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/extractClearingBatch`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');
    const envConfiguration = configuration;
    const kvConf = kvConfiguration;

    kernel = await new PaymentKernel(envConfiguration, kvConf)
      .initCache()
      .addMessagingPlugin(initRxMessagingPlugin())
      .useDb(true)
      .initDependencies();
    extractClearingBatch = kernel.get(ExtractClearingBatch);
    nockDone();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    nock.restore();
    nock.activate();
    /**
     * nock back available modes:
     * - wild: all requests go out to the internet, don't replay anything, doesn't record anything
     * - dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
     * - record: use recorded nocks, record new nocks
     * - lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record
     * @see https://github.com/nock/nock#modes
     */
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;

    const dispatcher = kernel.get(EventDispatcher);
    spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
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

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should dispatch the clearings in a clearing batch', async () => {
    await extractClearingBatch.execute({
      reference: '1000',
    });

    expect(spyOn_dispatch.mock.calls).toEqual(dispatchedClearingEvents);
  });

  it('Should dispatch nothing if the clearing batch is empty', async () => {
    await extractClearingBatch.execute({
      reference: '1003',
    });

    expect(spyOn_dispatch.mock.calls).toEqual([]);
  });

  it('Should dispatch the clearings in a clearing batch through the event handler', async () => {
    const eventHandler = new ClearingBatchReceivedEventHandler(
      kernel.get(ExtractClearingBatch),
      defaultLogger,
    );
    await eventHandler.handle(
      new ClearingBatchReceived({
        id: '1000',
        reference: '1000',
        type: '24',
      }),
    );

    expect(spyOn_dispatch.mock.calls).toEqual(dispatchedClearingEvents);
  });
});
