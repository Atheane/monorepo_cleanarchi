import { DefaultEventMessageBodyMapper } from '@oney/messages-adapters';
import { v4 } from 'uuid';
import { DeflateEventMessageBodySerializer } from '../../events/V1/DeflateEventMessageBodySerializer';
import { SampleEvent } from '../__fixtures__/events/SampleEvent';

describe('DeflateEventMessageBodySerializer', () => {
  it('should works', () => {
    const mapper = new DefaultEventMessageBodyMapper();
    const serializer = new DeflateEventMessageBodySerializer();

    const event = new SampleEvent();

    event.id = v4();

    const message = mapper.toEventMessageBody(event);
    const serializedMessage = serializer.serialize(message);

    const deserializedMessage = serializer.deserialize(serializedMessage);
    expect(deserializedMessage).toMatchObject(message);
  });
});
