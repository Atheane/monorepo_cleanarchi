import { injectable } from 'inversify';
import { SplitContractRepository, SplitContract, SplitContractError } from '../../../../../core/src/domain';
import { SplitContractMapper } from '../../mappers/SplitContractMapper';
import { SplitContractModel } from '../models/SplitContractModel';

@injectable()
export class MongoDbSplitContractRepository implements SplitContractRepository {
  private splitContractModel = SplitContractModel;

  constructor(private splitContractMapper: SplitContractMapper) {}

  async save(contract: SplitContract): Promise<SplitContract> {
    const splitContractToSave: SplitContractModel = this.splitContractMapper.fromDomain(contract);
    const result = await this.splitContractModel
      .findOneAndUpdate(
        {
          contractNumber: contract.props.contractNumber,
        },
        { $set: splitContractToSave, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return this.splitContractMapper.toDomain(result);
  }

  async getByContractNumber(contractNumber: string): Promise<SplitContract> {
    const result = await this.splitContractModel
      .findOne({
        contractNumber,
      })
      .select('-_id')
      .lean();
    if (!result) {
      throw new SplitContractError.NotFound();
    }
    return this.splitContractMapper.toDomain(result);
  }
}
