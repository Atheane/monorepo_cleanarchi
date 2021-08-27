import { OdbCallbackPayloadRepository } from '@oney/payment-adapters';
import { RawCallbackPayload } from '@oney/payment-core';
import { CallbackType } from '@oney/payment-messages';
import { InMemoryWriteService } from '@oney/common-adapters';

describe('testsuite of OdbCallbackPayloadRepository', () => {
  it('should return the payload', async () => {
    // mocks
    const writer = new InMemoryWriteService(new Map());

    // params
    const props = {
      data: { message: 'hello world' },
      date: new Date(),
      id: 'azerty',
      type: CallbackType.DILIGENCE_SCT_IN,
    };
    const payload = new RawCallbackPayload(props);

    // usage
    const odbCallbackPayloadRepository = new OdbCallbackPayloadRepository(writer);
    const receivedPayload = await odbCallbackPayloadRepository.save(payload);

    expect(receivedPayload).toStrictEqual(payload);
  });
});
