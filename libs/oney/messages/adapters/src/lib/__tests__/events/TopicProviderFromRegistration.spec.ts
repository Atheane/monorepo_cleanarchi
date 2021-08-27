import { EventMetadata } from '@oney/messages-core';
import { DefaultTopicProviderFromEvent } from '../../events/DefaultTopicProviderFromEvent';
import { TopicProviderFromRegistration } from '../../events/TopicProviderFromRegistration';
import { SampleEvent } from '../__fixtures__/events/SampleEvent';
import { SampleEventHandler } from '../__fixtures__/events/SampleEventHandler';

describe('TopicProviderFromRegistration', () => {
  let topicProvider: TopicProviderFromRegistration;
  beforeEach(() => {
    topicProvider = new TopicProviderFromRegistration(new DefaultTopicProviderFromEvent());
  });

  it('when a topic is specified, it should be returns', () => {
    const topics = topicProvider.getTopics({
      handler: SampleEventHandler,
      event: SampleEvent,
      options: { topic: '3712' },
    });

    const expected = ['3712'];

    expect(topics).toEqual(expected);
  });

  it('when a topic is unspecified, the metadata should be returns', () => {
    const topics = topicProvider.getTopics({
      handler: SampleEventHandler,
      event: SampleEvent,
      options: { topic: undefined },
    });

    const metadata = EventMetadata.getFromCtor(SampleEvent);

    const expected = [metadata.namespace];

    expect(topics).toEqual(expected);
  });
});
