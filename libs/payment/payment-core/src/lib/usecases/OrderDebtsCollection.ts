import { Usecase } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { EventDispatcher } from '@oney/messages-core';
import { DebtEvents, DebtsCollectionOrdered } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { BankAccountRepositoryRead } from '../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { PaymentIdentifier } from '../PaymentIdentifier';
import { SyncAccountDebts } from './debt/SyncAccountDebts';

export interface OrderDebtsCollectionCommand {
  uid: string;
  amount: number;
}

@injectable()
export class OrderDebtsCollection implements Usecase<OrderDebtsCollectionCommand, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly bankAccountRepositoryRead: BankAccountRepositoryRead,

    @inject(EventDispatcher)
    private readonly eventDispatcher: EventDispatcher,

    @inject(SymLogger)
    private readonly logger: Logger,

    @inject(SyncAccountDebts)
    private readonly syncAccountDebts: SyncAccountDebts,
  ) {}
  async execute({ uid, amount }: OrderDebtsCollectionCommand): Promise<void> {
    this.logger.info(`uid: ${uid} synchronizing debts from partner`);
    await this.syncAccountDebts.execute(uid);

    const bankAccountForCollection = await this.bankAccountRepositoryRead.findById(uid);

    if (bankAccountForCollection.hasUnpaidDebts()) {
      const debtsCollectionOrdered = new DebtsCollectionOrdered({ uid, amount });
      await this.eventDispatcher.dispatch(debtsCollectionOrdered);
      this.logger.info(`Dispatched ${DebtEvents.DEBTS_COLLECTION_ORDERED} event for uid: ${uid}`);
    }
  }
}
