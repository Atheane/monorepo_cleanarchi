import { Mapper } from '@oney/common-core';
import { CustomerSituations, InternalIncidents } from '@oney/profile-core';
import { injectable } from 'inversify';
import * as moment from 'moment';
import { CustomerSituationsResponse } from '../providers/OneyB2B/models/CustomerSituationsResponse';

@injectable()
export class OneyB2BCustomerResponseMapper implements Mapper<CustomerSituations, CustomerSituationsResponse> {
  toDomain(raw: CustomerSituationsResponse): CustomerSituations {
    return new CustomerSituations({
      lead: !parseInt(raw.customer_flag),

      ...(raw.internal_incidents && {
        internalIncidents: new InternalIncidents({
          ...(raw.internal_incidents.worse_unpaid_stage && {
            worseUnpaidStage: raw.internal_incidents.worse_unpaid_stage,
          }),
          ...(raw.internal_incidents.worse_household_functioning_status_code && {
            worseHouseholdFunctioningStatusCode: parseInt(
              raw.internal_incidents.worse_household_functioning_status_code,
            ),
          }),
          ...(raw.internal_incidents.last_worse_household_functioning_status_code_update_date && {
            worseHouseholdFunctioningStatusCodeLastUpdate: moment
              .utc(raw.internal_incidents.last_worse_household_functioning_status_code_update_date)
              .toDate(),
          }),
          ...(raw.internal_incidents.store_credit_limit_blocked_flag && {
            storeCreditLimitBlocked: Boolean(
              parseInt(raw.internal_incidents.store_credit_limit_blocked_flag),
            ),
          }),
          ...(raw.internal_incidents.store_credit_limit_blocked_reason && {
            storeCreditLimitBlockReason: raw.internal_incidents.store_credit_limit_blocked_reason,
          }),
          ...(raw.internal_incidents.vplus_credit_limit_blocked_flag && {
            oneyVplusCreditLimitBlocked: Boolean(
              parseInt(raw.internal_incidents.vplus_credit_limit_blocked_flag),
            ),
          }),
          ...(raw.internal_incidents.vplus_credit_limit_blocked_reason && {
            oneyVplusCreditLimitBlockReason: raw.internal_incidents.vplus_credit_limit_blocked_reason,
          }),
          ...(raw.internal_incidents.reconfiguration_flag && {
            debtRestructured: Boolean(parseInt(raw.internal_incidents.reconfiguration_flag)),
          }),
          ...(raw.internal_incidents.indebtedness_flag && {
            overIndebted: Boolean(parseInt(raw.internal_incidents.indebtedness_flag)),
          }),
          ...(raw.internal_incidents.ended_amicable_collecting_date && {
            amicableExitDate: moment.utc(raw.internal_incidents.ended_amicable_collecting_date).toDate(),
          }),
        }),
      }),
      ...(raw.credit_accounts_situation && {
        creditAccountsSituation: {
          totalOutstandingCredit: Number(raw.credit_accounts_situation.total_outstanding_amount),
        },
      }),
    });
  }
}
