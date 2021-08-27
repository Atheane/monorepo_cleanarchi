import { inject, injectable } from 'inversify';
import {
  BankAccountError,
  PaymentIdentifier,
  BankAccountRepositoryRead,
  BankAccount,
} from '@oney/payment-core';
import { QueryService } from '@oney/common-core';
import { AccountDbModel } from '../../../mongodb/models/BankAccountModel';
import { OdbBankAccountMapper } from '../../../mappers/OdbBankAccountMapper';

@injectable()
export class OdbBankAccountRepository implements BankAccountRepositoryRead {
  constructor(
    @inject(PaymentIdentifier.accountManagementQueryService) private readonly _queryService: QueryService,
    private readonly _odbBankAccountMapper: OdbBankAccountMapper,
  ) {}

  async findById(id: string): Promise<BankAccount> {
    const result = await this._queryService.findOne<AccountDbModel>({ uid: id });
    if (!result) {
      throw new BankAccountError.BankAccountNotFound('BANK_ACCOUNT_NOT_FOUND');
    }
    return this._odbBankAccountMapper.toDomain({
      uid: result.uid,
      beneficiaries: result.beneficiaries,
      bic: result.bic,
      bid: result.bid,
      cards: result.cards.map(item => ({ ...item, cardid: item.cid })),
      iban: result.iban,
      monthlyAllowance: result.monthlyAllowance,
      ...(result.kycDiligenceStatus && { kycDiligenceStatus: result.kycDiligenceStatus }),
      ...(result.kycDiligenceValidationMethod && {
        kycDiligenceValidationMethod: result.kycDiligenceValidationMethod,
      }),
      debts: result.debts,
      limits: result.limits,
      uncappingState: result.uncappingState,
      productsEligibility: result.productsEligibility,
    });
  }

  async findByIban(iban: string): Promise<BankAccount> {
    const result = await this._queryService.findOne<AccountDbModel>({ iban });
    if (!result) {
      throw new BankAccountError.BankAccountNotFound('BANK_ACCOUNT_NOT_FOUND');
    }
    return this._odbBankAccountMapper.toDomain({
      uid: result.uid,
      beneficiaries: result.beneficiaries,
      bic: result.bic,
      bid: result.bid,
      cards: result.cards.map(item => ({ ...item, cardid: item.cid })),
      iban: result.iban,
      monthlyAllowance: result.monthlyAllowance,
      ...(result.kycDiligenceStatus && { kycDiligenceStatus: result.kycDiligenceStatus }),
      ...(result.kycDiligenceValidationMethod && {
        kycDiligenceValidationMethod: result.kycDiligenceValidationMethod,
      }),
      debts: result.debts,
      limits: result.limits,
      uncappingState: result.uncappingState,
      productsEligibility: result.productsEligibility,
    });
  }

  async getAll(): Promise<BankAccount[]> {
    const result = await this._queryService.find<AccountDbModel>({});
    const bankAccounts = result.map(account =>
      this._odbBankAccountMapper.toDomain({
        uid: account.uid,
        beneficiaries: account.beneficiaries,
        bic: account.bic,
        bid: account.bid,
        cards: account.cards.map(item => ({ ...item, cardid: item.cid })),
        iban: account.iban,
        monthlyAllowance: account.monthlyAllowance,
        ...(account.kycDiligenceStatus && { kycDiligenceStatus: account.kycDiligenceStatus }),
        ...(account.kycDiligenceValidationMethod && {
          kycDiligenceValidationMethod: account.kycDiligenceValidationMethod,
        }),
        debts: account.debts,
        limits: account.limits,
        uncappingState: account.uncappingState,
        productsEligibility: account.productsEligibility,
      }),
    );
    return bankAccounts;
  }
}
