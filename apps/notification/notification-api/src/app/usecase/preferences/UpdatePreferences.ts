import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { Recipient } from '../../domain/entities/Recipient';
import { PreferencesProperties } from '../../domain/valuesObjects/Preferences';
import { RecipientRepository } from '../../domain/repositories/RecipientRepository';

export interface UpdatePreferencesCommand {
  uid: string;
  preferences: PreferencesProperties;
}
@injectable()
export class UpdatePreferences implements Usecase<UpdatePreferencesCommand, Recipient> {
  constructor(
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.RecipientRepository)
    private readonly recipientRepository: RecipientRepository,
  ) {}

  async execute({ uid, preferences }: UpdatePreferencesCommand): Promise<Recipient> {
    const recipientToUpdate = await this.recipientRepository.findBy(uid);
    recipientToUpdate.updatePreferences(preferences);
    defaultLogger.info(`Updating preferences of recipient with uid: ${recipientToUpdate.props.uid} in db`);
    const recipientSaved = await this.recipientRepository.save(recipientToUpdate);
    defaultLogger.info(`Dispatching recipient domain events with uid: ${recipientToUpdate.props.uid}`);
    await this._eventDispatcher.dispatch(recipientToUpdate);
    return recipientSaved;
  }
}
