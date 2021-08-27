import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { Recipient } from '../../domain/entities/Recipient';
import { Preferences } from '../../domain/valuesObjects/Preferences';
import { RecipientRepository } from '../../domain/repositories/RecipientRepository';
import { Profile, ProfileProperties } from '../../domain/valuesObjects/Profile';

interface RegisterRecipientCommand {
  uid: string;
  profile: ProfileProperties;
}

@injectable()
export class RegisterRecipient implements Usecase<RegisterRecipientCommand, Promise<Recipient>> {
  constructor(
    @inject(Identifiers.RecipientRepository)
    private readonly registerRepository: RecipientRepository,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(command: RegisterRecipientCommand): Promise<Recipient> {
    defaultLogger.info(`Creating recipient for uid: ${command.uid}`);
    const { profile: profileFromCommand, uid } = command;

    const profileToRegister = Profile.create(profileFromCommand);
    const preferencesToRegister = Preferences.create({
      allowAccountNotifications: true,
      allowTransactionNotifications: true,
    });
    const accountToRegister = Recipient.create({
      uid: uid,
      profile: profileToRegister,
      preferences: preferencesToRegister,
    });

    await this.eventDispatcher.dispatch(accountToRegister);
    defaultLogger.info(`Events dispatched after Registered recipient for uid: ${uid}`);

    return this.registerRepository.save(accountToRegister);
  }
}
