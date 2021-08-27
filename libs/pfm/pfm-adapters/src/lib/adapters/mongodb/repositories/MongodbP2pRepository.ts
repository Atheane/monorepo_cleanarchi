import { injectable } from 'inversify';
import { P2p, P2pRepository } from '@oney/pfm-core';
import * as mongoose from 'mongoose';
import { P2pMongoMapper } from '../../mappers/P2pMongoMapper';
import { P2pDoc } from '../models';

@injectable()
export class MongodbP2pRepository implements P2pRepository {
  private readonly model: mongoose.Model<P2pDoc>;
  private readonly p2pMongoMapper: P2pMongoMapper;

  constructor(model: mongoose.Model<P2pDoc>, p2pMongoMapper: P2pMongoMapper) {
    this.model = model;
    this.p2pMongoMapper = p2pMongoMapper;
  }

  async create(payment: P2p): Promise<P2p> {
    const created = await this.model
      .findOneAndUpdate(
        {
          id: payment.id,
        },
        { ...payment.props, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();

    return new P2p(created);
  }

  async getAll(accountIds: string[], options?: { dateFrom?: number; dateTo?: number }): Promise<P2p[]> {
    const res = await this.model.find({
      $or: [{ 'beneficiary.id': { $in: accountIds } }, { 'sender.id': { $in: accountIds } }],
    });

    const p2pWithDate = res.map(item => this.p2pMongoMapper.toDomain(item));

    return p2pWithDate.filter(item => {
      // eslint-disable-next-line no-underscore-dangle
      if (options && options.dateFrom && !(new Date(Number(options.dateFrom)) <= item.props.date)) {
        return false;
      }
      if (options && options.dateTo && !(item.props.date <= new Date(Number(options.dateTo)))) {
        return false;
      }
      return true;
    });
  }

  async getById(p2pId: string): Promise<P2p> {
    const foundP2p = await this.model.findOne({ orderId: p2pId });
    if (foundP2p) {
      return this.p2pMongoMapper.toDomain(foundP2p);
    }
    return null;
  }
}
