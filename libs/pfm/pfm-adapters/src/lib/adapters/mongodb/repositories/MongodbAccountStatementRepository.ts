import { injectable } from 'inversify';
import { Model } from 'mongoose';
import {
  AccountStatementProperties,
  AccountStatementRepository,
  AccountStatementState,
} from '@oney/pfm-core';
import { AccountStatementMapper } from '../../mappers';
import { AccountStatementDoc } from '../models';

@injectable()
export class MongoDbAccountStatementRepository implements AccountStatementRepository {
  constructor(
    private model: Model<AccountStatementDoc>,
    private accountStatementMapper: AccountStatementMapper,
  ) {}

  async getListByUserId(uid: string): Promise<AccountStatementProperties[]> {
    const accountStatements = await this.model.find({
      uid,
      documentAvailable: true,
      documentState: AccountStatementState.VERIFIED,
    });

    return accountStatements.map(accountStatement => ({
      id: accountStatement.asid,
      uid: accountStatement.uid,
      date: new Date(accountStatement.dateFrom),
    }));
  }

  async exists(uid: string, dateTo: Date): Promise<boolean> {
    const foundStatement = await this.model
      .findOne({
        uid: uid,
        dateTo: dateTo,
      })
      .lean();

    return !!foundStatement;
  }

  async save(props: AccountStatementProperties): Promise<AccountStatementProperties> {
    const statement = await this.model
      .findOneAndUpdate(
        {
          uid: props.uid,
          dateTo: props.dateTo,
        },
        { ...props, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();

    // TO-DO aggregate root (domain event)
    return statement;
  }
}
