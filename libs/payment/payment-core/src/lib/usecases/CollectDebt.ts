import { Usecase } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { AllDebtsFullyCollected } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { Transfer } from '../domain/aggregates/Transfer';
import { BankAccountGateway } from '../domain/gateways/BankAccountGateway';
import { DebtGateway } from '../domain/gateways/DebtGateway';
import { BankAccountRepositoryRead } from '../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../domain/repository/bankAccounts/BankAccountRepositoryWrite';
import { PaymentRepositoryWrite } from '../domain/repository/payment/PaymentRepositoryWrite';
import { TagRepositoryRead } from '../domain/repository/payment/TagRepositoryRead';
import { DebtCollectionTransferOrder } from '../domain/types/DebtCollectionTransferOrder';
import { CounterParty } from '../domain/valueobjects/CounterParty';
import { PaymentIdentifier } from '../PaymentIdentifier';
import { P2PDebtCollectionConfig } from '../domain/types/P2PDebtCollectionConfig';

export interface CollectDebtCommand {
  uid: string;
  amount: number;
}

@injectable()
export class CollectDebt implements Usecase<CollectDebtCommand, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly _eventDispatcherProducer: EventProducerDispatcher,
    @inject(EventDispatcher)
    private readonly eventDispatcher: EventDispatcher,
    @inject(PaymentIdentifier.paymentRepositoryRead)
    private readonly paymentRepositoryRead: TagRepositoryRead,
    @inject(PaymentIdentifier.paymentRepositoryWrite)
    private readonly paymentRepositoryWrite: PaymentRepositoryWrite,
    @inject(PaymentIdentifier.debtGateway)
    private readonly debtGateway: DebtGateway,
    @inject(PaymentIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.p2pdDebtCollectionConfiguration)
    private readonly p2pDebtCollectionConfig: P2PDebtCollectionConfig,
    @inject(SymLogger) private readonly logger: Logger,
  ) {}
  async execute({ uid, amount }: CollectDebtCommand): Promise<void> {
    this.logger.info(`Executing CollectDebt using uid: ${uid} and amount: ${amount}`);
    try {
      const { beneficiary: beneficiaryUid, reference: P2PReference } = this.p2pDebtCollectionConfig;
      const bankAccountUsedForCollection = await this.bankAccountRepositoryRead.findById(uid);

      if (bankAccountUsedForCollection.hasUnpaidDebts()) {
        const debtCollectionsThatCanBePaid = bankAccountUsedForCollection.getDebtCollections(amount);
        this.logger.info(`CollectDebt uid: ${uid} collections to process: `, debtCollectionsThatCanBePaid);

        for (const debtCollection of debtCollectionsThatCanBePaid) {
          const { debt: debtToCollect } = debtCollection;

          const transfer = await this.createTransferP2PForCollection({
            beneficiaryId: beneficiaryUid,
            debtCollection: debtCollection,
            senderToCollect: bankAccountUsedForCollection,
            tagReference: P2PReference,
          });

          bankAccountUsedForCollection.collectDebt(debtToCollect, transfer);
          const debtCollected = bankAccountUsedForCollection.getDebtById(debtToCollect.id);

          await this.paymentRepositoryWrite.create(
            bankAccountUsedForCollection.props.uid,
            transfer.props.beneficiary.uid,
            transfer,
          );
          this.logger.info(`uid: ${uid} saving account after debt collection`);
          await this.bankAccountRepositoryWrite.save(bankAccountUsedForCollection);

          this.logger.info(`uid: ${uid} updating debt on our partner api`, debtCollected);
          await this.debtGateway.updateRemainingAmount(debtCollected);
          await this.debtGateway.updateStatus(debtCollected);
        }
        if (!bankAccountUsedForCollection.hasUnpaidDebts()) {
          this.logger.info(`CollectDebt using uid: ${uid} all debt fully collected`);
          this.eventDispatcher.dispatch(new AllDebtsFullyCollected({ uid }));
        }
        this._eventDispatcherProducer.dispatch(bankAccountUsedForCollection);
      }
    } catch (e) {
      this.logger.error(
        `Error while processing debt collection for uid: ${uid}, using amout: ${amount}. Error details: ${e}`,
      );
    }
  }

  async createTransferP2PForCollection({
    tagReference,
    debtCollection,
    beneficiaryId,
    senderToCollect,
  }: DebtCollectionTransferOrder): Promise<Transfer> {
    const tagForCollectionTransfer = await this.paymentRepositoryRead.getByRef(tagReference);
    const beneficiary = await this.bankAccountGateway.getBankAccount(beneficiaryId);
    const { amountToCollect, debt } = debtCollection;

    return Transfer.createP2P({
      amount: amountToCollect,
      beneficiary: new CounterParty({
        id: beneficiary.props.bankAccountId,
        uid: beneficiary.props.uid,
      }),
      executionDate: new Date(),
      message: 'P2P Recouv',
      orderId: debt.getCollectionTransferOrderId(),
      sender: new CounterParty({
        id: senderToCollect.props.bankAccountId,
        uid: senderToCollect.props.uid,
      }),
      tag: tagForCollectionTransfer,
    });
  }
}
