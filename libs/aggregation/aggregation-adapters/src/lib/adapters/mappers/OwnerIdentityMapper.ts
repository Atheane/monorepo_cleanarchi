import { injectable } from 'inversify';
import { Mapper } from '@oney/common-core';
import { OwnerIdentity } from '@oney/aggregation-core';
import { BudgetInsightUserIdentityResponse } from '../partners/budgetinsights/models/BudgetInsightUserIdentityResponse';

@injectable()
export class OwnerIdentityMapper implements Mapper<OwnerIdentity> {
  toDomain(raw: BudgetInsightUserIdentityResponse): OwnerIdentity {
    const { owner } = raw;
    const ownerIdentity: OwnerIdentity = {
      identity: owner?.name,
      firstName: owner?.firstname,
      lastName: owner?.lastname,
      birthDate: owner?.birth_date ? new Date(owner.birth_date).toLocaleDateString() : undefined,
    };
    return ownerIdentity;
  }
}
