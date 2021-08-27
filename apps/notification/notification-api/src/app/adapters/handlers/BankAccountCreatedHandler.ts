import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { BankAccountCreated } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { Address } from '../../domain/valuesObjects/Address';
import { RegisterRecipient } from '../../usecase/recipient/RegisterRecipient';

@injectable()
export class BankAccountCreatedHandler extends DomainEventHandler<BankAccountCreated> {
  private readonly registerRecipient: RegisterRecipient;

  constructor(@inject(Identifiers.RegisterRecipient) registerRecipient: RegisterRecipient) {
    super();
    this.registerRecipient = registerRecipient;
  }

  async handle({ props }: BankAccountCreated): Promise<void> {
    defaultLogger.info(`Handling BankAccountCreated event for user: ${props.uid}`);
    try {
      const { address: addressFromEvent, uid } = props;
      const addressOfRecipientToRegister = Address.create({ ...addressFromEvent });
      const registeredRecipient = await this.registerRecipient.execute({
        uid,
        profile: { ...props, address: addressOfRecipientToRegister },
      });
      defaultLogger.info(`Recipient uid : ${registeredRecipient.props.uid} was registered`);
    } catch (e) {
      defaultLogger.error(`Error while handling BankAccountCreated, error:  ${e}`);
      throw e;
    }
  }
}
