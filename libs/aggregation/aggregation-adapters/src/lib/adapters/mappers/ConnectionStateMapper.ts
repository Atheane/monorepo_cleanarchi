import { ConnectionStateEnum } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { BudgetInsightConnectionState } from '../partners/budgetinsights/models/BudgetInsightConnectionState';

@injectable()
export class ConnectionStateMapper implements Mapper<ConnectionStateEnum> {
  toDomain(raw: string | null): ConnectionStateEnum {
    let state: ConnectionStateEnum;
    if (raw === null) {
      state = ConnectionStateEnum.VALID;
    } else if (raw === BudgetInsightConnectionState.SCA_REQUIRED) {
      state = ConnectionStateEnum.SCA;
    } else if (raw === BudgetInsightConnectionState.DECOUPLED) {
      state = ConnectionStateEnum.DECOUPLED;
    } else if (raw === BudgetInsightConnectionState.ADDITIONNAL_INFORMATION) {
      state = ConnectionStateEnum.MORE_INFORMATION;
    } else if (raw === BudgetInsightConnectionState.ACTION_NEEDED) {
      state = ConnectionStateEnum.ACTION_NEEDED;
    } else if (raw === BudgetInsightConnectionState.WRONG_PASSWORD) {
      //openapi do not have passwordExpired case, only wrongpass
      state = ConnectionStateEnum.PASSWORD_EXPIRED; //we treat them the same way in domain: we ask user to update its credentials
    } else if (raw === BudgetInsightConnectionState.PASSWORD_EXPIRED) {
      state = ConnectionStateEnum.PASSWORD_EXPIRED;
    } else if (
      raw === BudgetInsightConnectionState.BUG ||
      raw === BudgetInsightConnectionState.WEBSITE_UNAVAILABLE
    ) {
      state = ConnectionStateEnum.ERROR;
    }
    return state;
  }
}
