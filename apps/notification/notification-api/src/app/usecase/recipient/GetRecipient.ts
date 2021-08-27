import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { Recipient } from '../../domain/entities/Recipient';
import { RecipientRepository } from '../../domain/repositories/RecipientRepository';

interface RegisterRecipientCommand {
  uid: string;
}

@injectable()
export class GetRecipient implements Usecase<RegisterRecipientCommand, Promise<Recipient>> {
  constructor(
    @inject(Identifiers.RecipientRepository)
    private readonly registerRepository: RecipientRepository,
  ) {}

  async execute({ uid }: RegisterRecipientCommand): Promise<Recipient> {
    defaultLogger.info(`Getting recipient for uid: ${uid}`);
    return this.registerRepository.findBy(uid);
  }
}
