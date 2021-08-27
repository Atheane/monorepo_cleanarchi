import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { ContractStatus } from '@oney/credit-messages';
import { Authorization, Identity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { SplitPaymentSchedule } from '../../domain/entities';
import { SplitContractRepository, SplitPaymentScheduleRepository } from '../../domain/repositories';
import { SplitCreditDetails } from '../../domain/types/split';

export interface GetSplitContractsCommands {
  uid: string;
}

@injectable()
export class GetSplitContracts implements Usecase<GetSplitContractsCommands, Promise<SplitCreditDetails[]>> {
  constructor(
    @inject(CreditIdentifiers.splitContractRepository)
    private readonly contractRepository: SplitContractRepository,
    @inject(CreditIdentifiers.splitPaymentScheduleRepository)
    private readonly paymentScheduleRepository: SplitPaymentScheduleRepository,
  ) {}

  async execute(request: GetSplitContractsCommands): Promise<SplitCreditDetails[]> {
    const contracts = await this.contractRepository.getByUserId(request.uid);
    const paymentSchedules = await this.paymentScheduleRepository.getByUserId(request.uid);

    const result = contracts.map(
      async (contract): Promise<SplitCreditDetails> => {
        const paid = [ContractStatus.PAID, ContractStatus.PAID_ANTICIPATED, ContractStatus.CANCELED];
        let paymentSchedule: SplitPaymentSchedule;
        if (!paid.includes(contract.status)) {
          const splitPaymentScheduleProperties = paymentSchedules.find(
            p => p.contractNumber === contract.contractNumber,
          );
          if (splitPaymentScheduleProperties) {
            paymentSchedule = new SplitPaymentSchedule(splitPaymentScheduleProperties);
          }
        }

        const paymentScheduleExecution = paid.includes(contract.status)
          ? [
              ...contract.finalPaymentSchedule.getProps.paymentsExecution,
              contract.finalPaymentSchedule.getProps.fundingExecution,
            ]
          : paymentSchedule && [
              ...paymentSchedule.getProps.paymentsExecution,
              paymentSchedule.getProps.fundingExecution,
            ];

        return {
          userId: contract.userId,
          initialTransactionId: contract.initialTransactionId,
          transactionDate: contract.transactionDate,
          subscriptionDate: contract.subscriptionDate,
          productCode: contract.productCode,
          contractNumber: contract.contractNumber,
          apr: contract.apr,
          status: contract.status,
          termsVersion: contract.termsVersion,
          paymentScheduleExecution,
        };
      },
    );

    return Promise.all(result);
  }

  async canExecute(identity: Identity, request: GetSplitContractsCommands): Promise<boolean> {
    const scope =
      identity && identity.roles && identity.roles.find(item => item.scope.name === ServiceName.credit);
    if (!scope) {
      return false;
    }

    const isOwner = identity.uid === request.uid && scope.permissions.read === Authorization.self;
    if (isOwner) {
      return true;
    }
    const isAuthorizedAzureIdentity =
      scope.permissions.read === Authorization.all && identity.provider === IdentityProvider.azure;
    return isAuthorizedAzureIdentity;
  }
}
