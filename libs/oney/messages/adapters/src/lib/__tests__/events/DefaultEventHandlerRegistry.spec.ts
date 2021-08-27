import 'reflect-metadata';
import { DefaultEventHandlerRegistry } from '@oney/messages-adapters';
import { SampleEvent } from '../__fixtures__/events/SampleEvent';
import { SampleEventHandler } from '../__fixtures__/events/SampleEventHandler';

describe('DefaultEventHandlerRegistry', () => {
  let registry: DefaultEventHandlerRegistry;
  beforeEach(() => {
    registry = new DefaultEventHandlerRegistry();
  });

  it('registry entry should have options', () => {
    const options = { topic: '3712' };
    registry.register(SampleEvent, SampleEventHandler, options);

    const [entry] = registry.read();

    expect(entry.event).toBe(SampleEvent);
    expect(entry.handler).toBe(SampleEventHandler);
    expect(entry.options).toBe(options);
  });
});
