import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { SplitPaymentSchedule } from '../../../../core/src';
import { SplitContract } from '../../../../core/src/domain/entities/SplitContract';
import { ContractStatus, SplitProduct } from '../../../../core/src/domain/types';
import { SplitContractModel } from '../mongodb/models/SplitContractModel';
import { SplitContractProperties } from '../../../../core/src/domain/types/SplitContractProperties';

@injectable()
export class SplitContractMapper implements Mapper<SplitContract> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toDomain(raw: any): SplitContract {
    const {
      contractNumber,
      bankAccountId,
      userId,
      initialTransactionId,
      apr,
      productCode,
      subscriptionDate,
      status,
      initialPaymentSchedule,
      finalPaymentSchedule,
    } = raw;

    const splitContractToDomain: SplitContractProperties = {
      contractNumber,
      bankAccountId,
      userId,
      initialTransactionId,
      apr,
      productCode: SplitProduct[productCode],
      subscriptionDate,
      status: ContractStatus[status],
      initialPaymentSchedule,
    };

    if (finalPaymentSchedule) {
      splitContractToDomain.finalPaymentSchedule = new SplitPaymentSchedule(finalPaymentSchedule);
    }
    return new SplitContract(splitContractToDomain);
  }

  fromDomain({ props }: SplitContract): SplitContractModel {
    const splitContract: SplitContractModel = {
      contractNumber: props.contractNumber,
      bankAccountId: props.bankAccountId,
      userId: props.userId,
      initialTransactionId: props.initialTransactionId,
      apr: props.apr,
      productCode: props.productCode,
      subscriptionDate: props.subscriptionDate,
      status: props.status,
      initialPaymentSchedule: props.initialPaymentSchedule,
    };

    if (props.finalPaymentSchedule) {
      splitContract.finalPaymentSchedule = props.finalPaymentSchedule.props;
    }
    return splitContract;
  }
}
