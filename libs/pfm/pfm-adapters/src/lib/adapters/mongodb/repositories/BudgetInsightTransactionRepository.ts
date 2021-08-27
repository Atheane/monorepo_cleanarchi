import { injectable } from 'inversify';
import {
  Transaction,
  TransactionError,
  AggregationRepository,
  OrderEnum,
  TransactionQueryType,
  Event,
} from '@oney/pfm-core';
import * as mongoose from 'mongoose';
import { Logger } from '@oney/logger-core';
import { TransactionBudgetInsightMapper } from '../../mappers/TransactionBudgetInsightMapper';
import { EventDoc } from '../models';

@injectable()
export class BudgetInsightTransactionRepository implements AggregationRepository {
  private readonly model: mongoose.Model<EventDoc>;
  private readonly transactionBudgetInsightMapper: TransactionBudgetInsightMapper;
  private readonly logger: Logger;

  constructor(
    model: mongoose.Model<EventDoc>,
    transactionBudgetInsightMapper: TransactionBudgetInsightMapper,
    logger: Logger,
  ) {
    this.model = model;
    this.transactionBudgetInsightMapper = transactionBudgetInsightMapper;
    this.logger = logger;
  }

  uniqBy(array: any[], getKey): any[] {
    const indexes = [];
    const result: any[] = [];
    array.forEach(t => {
      if (!indexes.includes(getKey(t))) {
        indexes.push(getKey(t));
        result.push(t);
      }
    });
    return result;
  }

  sortByDate(item: Event, nextItem: Event, order: OrderEnum): number {
    if (order === OrderEnum.ASC) {
      return Date.parse(item.date) - Date.parse(nextItem.date);
    }
    return Date.parse(nextItem.date) - Date.parse(item.date);
  }

  async getAll(accountsIds: string[], options?: TransactionQueryType): Promise<Transaction[]> {
    try {
      if (!accountsIds.length) {
        return [];
      }
      const query = accountsIds.map(id => ({ 'data.id': parseInt(id, 10) }));
      const events = await this.model.aggregate([{ $match: { $or: query } }]);
      const sortedEvents = events.sort((item, nextItem) => this.sortByDate(item, nextItem, OrderEnum.DESC));
      const nestedTransactions = sortedEvents.map(rawEvent =>
        rawEvent.data.transactions.map(transaction =>
          this.transactionBudgetInsightMapper.toDomain(transaction),
        ),
      );
      const transactions = [].concat(...nestedTransactions);
      if (options) {
        const { sortBy, dateFrom, dateTo } = options;
        return this.uniqBy(transactions, e => e.refId)
          .sort((item, nextItem) => this.sortByDate(item, nextItem, sortBy))
          .filter(
            transaction =>
              !transaction.deleted &&
              Date.parse(transaction.date) >= dateFrom &&
              Date.parse(transaction.date) < dateTo,
          );
      }
      return this.uniqBy(transactions, e => e.refId).filter(transaction => !transaction.deleted);
    } catch (e) {
      // this.logger.addTag(`${this.constructor.name}.getAll`);
      /* istanbul ignore next */
      this.logger.error(`getAll: ${e?.response?.data?.code}`, e?.response?.data || e);
      return [];
    }
  }

  async getByAccountId({
    accountId,
    options,
  }: {
    accountId: string;
    options?: TransactionQueryType;
  }): Promise<Transaction[]> {
    const events = await this.model.aggregate([{ $match: { 'data.id': parseInt(accountId, 10) } }]);
    if (!events || !events.length) {
      throw new TransactionError.AccountNotFound('No bank account corresponding to this accountId');
    }
    const sortedEvents = events.sort((item, nextItem) => this.sortByDate(item, nextItem, OrderEnum.DESC));
    const nestedTransactions = sortedEvents.map(rawEvent =>
      rawEvent.data.transactions.map(transaction =>
        this.transactionBudgetInsightMapper.toDomain(transaction),
      ),
    );
    const transactions = [].concat(...nestedTransactions);
    if (options) {
      const { sortBy, dateFrom, dateTo } = options;
      return this.uniqBy(transactions, e => e.refId)
        .sort((item, nextItem) => this.sortByDate(item, nextItem, sortBy))
        .filter(
          transaction =>
            !transaction.deleted &&
            Date.parse(transaction.date) >= dateFrom &&
            Date.parse(transaction.date) < dateTo,
        );
    }
    return this.uniqBy(transactions, e => e.refId).filter(transaction => !transaction.deleted);
  }

  async getByTransactionId(transactionId: string): Promise<Transaction> {
    const events = await this.model.aggregate([
      { $match: { 'data.transactions.id': parseInt(transactionId, 10) } },
    ]);
    const sortedEvents = events.sort((item, nextItem) => this.sortByDate(item, nextItem, OrderEnum.DESC));
    const nestedTransactions = sortedEvents.map(rawEvent =>
      rawEvent.data.transactions.map(transaction =>
        this.transactionBudgetInsightMapper.toDomain(transaction),
      ),
    );
    const transactions = [].concat(...nestedTransactions);
    return this.uniqBy(transactions, e => e.refId).filter(transaction => !transaction.deleted)[0];
  }
}
