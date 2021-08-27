/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify';
import { LegacyBankAccount } from '../../domain/entities/LegacyBankAccount';
import { CardLifecycleCallbackError } from '../../domain/models/DomainError';
import { BankAccountRepository } from '../../domain/repositories/LegacyBankAccountRepository';

@injectable()
export class InMemoryOdbLegacyBankAccountRepository implements BankAccountRepository {
  constructor(private store: Map<string, LegacyBankAccount>) {}

  async save(account: LegacyBankAccount): Promise<LegacyBankAccount> {
    this.store.set(account.id, account);
    return account;
  }

  async findByCardId(cid: string): Promise<LegacyBankAccount> {
    const foundAccountEntry = [...this.store].find(([id, account]) =>
      account.props.cards.find(card => card.cid === cid),
    );

    if (!foundAccountEntry) {
      throw new CardLifecycleCallbackError.RelatedBankAccountNotFound(
        `No bank account found for card ID ${cid}`,
      );
    }

    return foundAccountEntry[1];
  }
}
