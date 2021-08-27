import {
  Event,
  EventCtor,
  EventHandlerCtor,
  EventHandlerRegistration,
  EventHandlerRegistrationOptions,
  EventHandlerRegistry,
} from '@oney/messages-core';

export class DefaultEventHandlerRegistry extends EventHandlerRegistry {
  protected _registrations: Map<EventCtor, EventHandlerRegistration[]>;

  constructor() {
    super();
    this._registrations = new Map<EventCtor, EventHandlerRegistration[]>();
  }

  public register<TEvent extends Event>(
    event: EventCtor<TEvent>,
    handler: EventHandlerCtor<TEvent>,
    options?: EventHandlerRegistrationOptions,
  ): void {
    const entry = this.ensureRegistration(event);
    entry.push({ event, handler, options });
  }

  private ensureRegistration(event: EventCtor) {
    let entry = this._registrations.get(event);

    if (!entry) {
      entry = [];
      this._registrations.set(event, entry);
    }

    return entry;
  }

  public read(): EventHandlerRegistration[] {
    return Array.from(this._registrations.values()).flat();
  }
}
