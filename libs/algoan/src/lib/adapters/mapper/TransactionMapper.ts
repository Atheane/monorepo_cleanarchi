import { injectable } from 'inversify';
import { Transaction, TransactionType } from '../../domain/models/Transaction';
import { AlgoanTransactionResourceDto } from '../models/AlgoanTransactionElementsDto';

@injectable()
export class TransactionMapper {
  toDomain(algoanTransactionResource: AlgoanTransactionResourceDto): Transaction {
    let transaction: Transaction = {
      id: algoanTransactionResource._id,
      reference: algoanTransactionResource.reference,
      date: new Date(algoanTransactionResource.date),
      amount: algoanTransactionResource.amount,
      description: algoanTransactionResource.description,
      type: algoanTransactionResource.type as TransactionType,
      category: algoanTransactionResource.category,
      currency: algoanTransactionResource.currency,
      banksUserCardId: algoanTransactionResource.banksUserCardId,
      userDescription: algoanTransactionResource.userDescription,
      simplifiedDescription: algoanTransactionResource.simplifiedDescription,
    };
    if (!algoanTransactionResource._id) {
      transaction = {
        ...transaction,
        id: algoanTransactionResource.id,
        algoanCategory: algoanTransactionResource.algoanCategory,
        organizationId: algoanTransactionResource.organizationId,
        chatflowId: algoanTransactionResource.chatflowId,
        accountId: algoanTransactionResource.accountId,
        inserted: algoanTransactionResource.inserted,
        validity: algoanTransactionResource.validity,
        algoanType: algoanTransactionResource.algoanType,
        comments: algoanTransactionResource.comments,
      };
    }

    return transaction;
  }
}
