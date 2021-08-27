import { EventDispatcher, Event } from '@oney/messages-core';
import { injectable } from 'inversify';
import { TestEventReceiver } from './TestEventReceiver';

@injectable()
export class TestEventDispatcher extends EventDispatcher {
  private _receiver: TestEventReceiver;

  constructor(receiver: TestEventReceiver) {
    super();
    this._receiver = receiver;
  }

  public async doDispatch(events: Event[]): Promise<void> {
    for (const event of events) {
      await this._receiver.inject(event);
    }
  }
}
