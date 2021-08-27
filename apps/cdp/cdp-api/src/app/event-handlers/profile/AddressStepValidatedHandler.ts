import { DomainEventHandler } from '@oney/ddd';
import { AddressStepValidated } from '@oney/profile-messages';
import { sendDomainEventToEh } from './sendToEh';

export class AddressStepValidatedHandler extends DomainEventHandler<AddressStepValidated> {
  public async handle(domainEvent: AddressStepValidated): Promise<void> {
    console.log('Function called');
    const transferMessage = new Promise<void>(resolve => {
      // Uses props, aggregateId eventName to constitute the EH payload
      const outPayload = {};
      for (const [k, v] of Object.entries(AddressStepValidated.prototype.props)) {
        outPayload[k] = v;
      }
      outPayload['profileId'] = AddressStepValidated.prototype.metadata.aggregateId;
      outPayload['eventName'] = AddressStepValidated.prototype.metadata.eventName;
      console.log('Payload');
      console.log(outPayload);
      sendDomainEventToEh(outPayload, 'customer');
      resolve();
    });

    await transferMessage;

    return;
  }
}
