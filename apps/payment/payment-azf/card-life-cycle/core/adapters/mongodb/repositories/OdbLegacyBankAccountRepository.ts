import { injectable } from 'inversify';
import { LegacyBankAccount } from '../../../domain/entities/LegacyBankAccount';
import { CardLifecycleCallbackError } from '../../../domain/models/DomainError';
import { BankAccountRepository } from '../../../domain/repositories/LegacyBankAccountRepository';
import { OdbLegacyBankAccountModel } from '../models/OdbLegacyBankAccountModel';

@injectable()
export class OdbLegacyBankAccountRepository implements BankAccountRepository {
  private odbLegacyBankAccountModel = OdbLegacyBankAccountModel;

  async findByCardId(cid: string): Promise<LegacyBankAccount> {
    const foundAccount = await this.odbLegacyBankAccountModel.findOne({ 'cards.cid': cid });

    if (!foundAccount) {
      throw new CardLifecycleCallbackError.RelatedBankAccountNotFound(
        `No bank account found for card ID ${cid}`,
      );
    }

    return new LegacyBankAccount({
      uid: foundAccount.uid,
      bid: foundAccount.bid,
      iban: foundAccount.iban,
      bic: foundAccount.bic,
      cards: foundAccount.cards.map(item => ({ ...item, cardid: item.cid })),
      beneficiary: foundAccount.beneficiaries,
    });
  }
}
