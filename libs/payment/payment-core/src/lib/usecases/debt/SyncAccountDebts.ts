import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { Debt } from '../../domain/entities/Debt';
import { DebtGateway } from '../../domain/gateways/DebtGateway';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';
import { PaymentIdentifier } from '../../PaymentIdentifier';

@injectable()
export class SyncAccountDebts implements Usecase<string, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.debtGateway)
    private readonly _debtGateway: DebtGateway,

    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,

    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,

    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,

    @inject(SymLogger)
    private readonly logger: Logger,
  ) {}

  async execute(uid: string): Promise<BankAccount> {
    this.logger.info(`uid: ${uid} starting SyncAccountDebts`);
    const bankAccount = await this._bankAccountRepositoryRead.findById(uid);

    const debtsFromPartner: Debt[] = await this._debtGateway.getDebtsBy(uid);
    this.logger.info(`uid: ${uid} using fetched partner debts`, debtsFromPartner);

    for (const debtFromPartner of debtsFromPartner) {
      const isDebtExist = bankAccount.isDebtExist(debtFromPartner);
      this.logger.info(`uid: ${uid} check existence of debt`, debtFromPartner);

      if (!isDebtExist) {
        this.logger.info(`uid: ${uid} creating new debt`, debtFromPartner);
        bankAccount.createDebt(debtFromPartner);
      }
    }

    await this._bankAccountRepositoryWrite.save(bankAccount);
    this.logger.info(`uid: ${uid} account saved after SyncAccountDebts`);

    if (bankAccount.hasEvents()) {
      await this._eventDispatcher.dispatch(bankAccount);
    }

    return bankAccount;
  }
}
