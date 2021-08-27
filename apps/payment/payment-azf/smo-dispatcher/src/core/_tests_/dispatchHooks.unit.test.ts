/* eslint-env jest */
import { ConfigService } from '@oney/env';
import { EventDispatcher } from '@oney/messages-core';
import {
  DispatchHooks,
  DiligenceSctInCallbackError,
  DispatcherError,
  KycCallbackError,
  SDDCallbackError,
  CardOperationCallbackError,
  ClearingBatchCallbackError,
} from '@oney/payment-core';
import { Container } from 'inversify';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import {
  diligenceSctInPayload,
  diligenceSctInReceivedDomainEvent,
  kycPayload,
  kycUpdatedDomainEvent,
  unsupportedPayload,
  diligenceSctInBrokenPayload,
  kycBrokenPayload,
  lcbFtPayload,
  lcbFtBrokenPayload,
  lcbFtUpdateDomainEvent,
  sddInPayload,
  sddBrokenPayload,
  sddReceivedDomainEvent,
  copBrokenPayload,
  copPayload,
  copReceivedDomainEvent,
  clearingBatchPayload,
  clearingBatchBrokenPayload,
  clearingBatchDomainEvent,
} from './fixtures/dispatchKycCallback.fixtures';
import { EnvConfiguration, KeyVaultSecrets } from '../../config/EnvConfiguration';
import { AzfKernel } from '../di/Kernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
nockBack.setMode('record');

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

describe('Process callback dispatcher unit testing', () => {
  let container: Container;
  let dispatchHooks: DispatchHooks;
  let spyOn_dispatch;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const envConfiguration = new EnvConfiguration();
    const keyvaultConfiguration = new KeyVaultSecrets();
    container = await new AzfKernel(envConfiguration, keyvaultConfiguration).initDependencies(true);

    dispatchHooks = container.get(DispatchHooks);
  });

  beforeEach(async () => {
    nock.cleanAll();
    MockDate.reset();

    const dispatcher = container.get(EventDispatcher);
    spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
  });

  describe('EKyc', () => {
    it('should process the dispatch of the Ekyc payload', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute(kycPayload);

      expect(spyOn_dispatch).toHaveBeenCalledWith(kycUpdatedDomainEvent);
    });

    it('should process the dispatch of the Ekyc payload with int type', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute({
        ...kycPayload,
        payload: {
          ...kycPayload.payload,
          type: 4,
        },
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(kycUpdatedDomainEvent);
    });

    it('should fail to process the dispatch of the Ekyc payload if the payload is wrong', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      const promise = dispatchHooks.execute(kycBrokenPayload);

      await expect(promise).rejects.toThrow(new KycCallbackError.InvalidCallbackPayload({}));
    });
  });

  describe('Diligence SCT IN', () => {
    it('should process the dispatch of the diligence sct in payload', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute(diligenceSctInPayload);

      expect(spyOn_dispatch).toHaveBeenCalledWith(diligenceSctInReceivedDomainEvent);
    });

    it('should process the dispatch of the diligence sct in payload with int type', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute({
        ...diligenceSctInPayload,
        payload: {
          ...diligenceSctInPayload.payload,
          type: 31,
        },
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(diligenceSctInReceivedDomainEvent);
    });

    it('should fail to process the dispatch of the diligence sct in payload if the payload is wrong', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      const promise = dispatchHooks.execute(diligenceSctInBrokenPayload);

      await expect(promise).rejects.toThrow(new DiligenceSctInCallbackError.InvalidCallbackPayload({}));
    });
  });

  describe('SDD', () => {
    it('should process the dispatch of the SDD in payload', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute(sddInPayload);

      expect(spyOn_dispatch).toHaveBeenCalledWith(sddReceivedDomainEvent);
    });

    it('should fail to process the dispatch of the diligence sct in payload if the payload is wrong', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      const promise = dispatchHooks.execute(sddBrokenPayload);

      await expect(promise).rejects.toThrow(new SDDCallbackError.InvalidCallbackPayload({}));
    });
  });

  describe('LCB FT', () => {
    it('should process the dispatch of the LCB FT payload', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute(lcbFtPayload);

      expect(spyOn_dispatch).toHaveBeenCalledWith(lcbFtUpdateDomainEvent);
    });

    it('should process the dispatch of the LCB FT payload with int type', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute({
        ...lcbFtPayload,
        payload: {
          ...lcbFtPayload.payload,
          type: 32,
        },
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(lcbFtUpdateDomainEvent);
    });

    it('should fail to process the dispatch of the diligence sct in payload if the payload is wrong', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      const promise = dispatchHooks.execute(lcbFtBrokenPayload);

      await expect(promise).rejects.toThrow(new KycCallbackError.InvalidCallbackPayload({}));
    });
  });

  describe('COP', () => {
    it('should process the dispatch of the COP in payload', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute(copPayload);

      expect(spyOn_dispatch).toHaveBeenCalledWith(copReceivedDomainEvent);
    });

    it('should fail to process the dispatch of the cop in payload if the payload is wrong', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      const promise = dispatchHooks.execute(copBrokenPayload);

      await expect(promise).rejects.toThrow(new CardOperationCallbackError.InvalidCallbackPayload({}));
    });
  });

  describe('Clearing Batch', () => {
    it('should process the dispatch of the Clearing Batch in payload', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      await dispatchHooks.execute(clearingBatchPayload);

      expect(spyOn_dispatch).toHaveBeenCalledWith(clearingBatchDomainEvent);
    });

    it('should fail to process the dispatch of the Clearing Batch in payload if the payload is wrong', async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      const promise = dispatchHooks.execute(clearingBatchBrokenPayload);

      await expect(promise).rejects.toThrow(new ClearingBatchCallbackError.InvalidCallbackPayload({}));
    });
  });

  describe('Generic dispatch workflow', () => {
    it('should fail if the callback type is not supported', async () => {
      const promise = dispatchHooks.execute(unsupportedPayload);

      await expect(promise).rejects.toThrowError(
        new DispatcherError.CallbackNotSupported(unsupportedPayload),
      );
    });

    it('should fail if no payload is set', async () => {
      const promise = dispatchHooks.execute({ payload: null });

      await expect(promise).rejects.toThrowError(new DispatcherError.PayloadNotFound());
    });
  });
});
