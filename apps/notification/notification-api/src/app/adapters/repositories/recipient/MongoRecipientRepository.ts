import { defaultLogger } from '@oney/logger-adapters';
import { injectable } from 'inversify';
import { RecipientDaoProperties } from '../../../database/RecipientDaoProperties';
import { RecipientModel } from '../../../database/schemas/recipient';
import { Recipient } from '../../../domain/entities/Recipient';
import { RecipientError } from '../../../domain/models/DomainError';
import { RecipientRepository } from '../../../domain/repositories/RecipientRepository';
import { RecipientMapper } from '../../mappers/RecipientMapper';

@injectable()
export class MongoRecipientRepository implements RecipientRepository {
  constructor(private readonly recipientMapper: RecipientMapper) {}

  async findBy(uid: string): Promise<Recipient> {
    try {
      const recipientFromDB: RecipientDaoProperties = await RecipientModel.findOne({ uid: uid }).lean();
      if (recipientFromDB) {
        const recipient = this.recipientMapper.toDomain(recipientFromDB);
        return recipient;
      }
      throw new RecipientError.RecipientNotFound();
    } catch (e) {
      defaultLogger.error(`Error while findby recipient uid: ${uid}, error: ${e}`);
      throw e;
    }
  }

  async save(recipientToSave: Recipient): Promise<Recipient> {
    try {
      const recipientToSaveInDB = this.recipientMapper.fromDomain(recipientToSave);
      const upsertOptions = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      };
      const recipientSavedInDB: RecipientDaoProperties = await RecipientModel.findOneAndUpdate(
        { uid: recipientToSaveInDB.uid },
        { $set: recipientToSaveInDB },
        upsertOptions,
      ).lean();
      return this.recipientMapper.toDomain(recipientSavedInDB);
    } catch (e) {
      defaultLogger.error(`Error while saving recipient uid: ${recipientToSave.props.uid}, error: ${e}`);
      throw e;
    }
  }
}
