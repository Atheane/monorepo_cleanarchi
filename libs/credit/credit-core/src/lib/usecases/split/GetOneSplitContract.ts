import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { ContractStatus } from '@oney/credit-messages';
import { defaultLogger } from '@oney/logger-adapters';
import { Authorization, Identity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { SplitContractRepository, SplitPaymentScheduleRepository } from '../../domain/repositories';
import { SplitContractProperties, SplitCreditDetails } from '../../domain/types';
import { SplitPaymentSchedule } from '../../domain/entities';

export interface GetSplitCommands {
  uid: string;
  initialTransactionId: string;
}

@injectable()
export class GetOneSplitContract implements Usecase<GetSplitCommands, SplitCreditDetails> {
  constructor(
    @inject(CreditIdentifiers.splitContractRepository)
    private readonly contractRepository: SplitContractRepository,
    @inject(CreditIdentifiers.splitPaymentScheduleRepository)
    private readonly paymentScheduleRepository: SplitPaymentScheduleRepository,
  ) {}

  async execute(request: GetSplitCommands): Promise<SplitCreditDetails | null> {
    let paymentSchedule: SplitPaymentSchedule;
    let contract: SplitContractProperties;
    try {
      contract = await this.contractRepository.getByInitialTransactionId(request.initialTransactionId);
    } catch (e) {
      defaultLogger.warn(
        `Cannot get contractRepository for the initialTransactionId: ${request.initialTransactionId}`,
      );
      throw e;
    }

    const paid = [ContractStatus.PAID, ContractStatus.PAID_ANTICIPATED, ContractStatus.CANCELED];
    try {
      if (!paid.includes(contract.status)) {
        paymentSchedule = new SplitPaymentSchedule(
          await this.paymentScheduleRepository.getByContractNumber(contract.contractNumber),
        );
      }
    } catch (e) {
      defaultLogger.info(
        `Cannot get paymentSchedule for the contractNumber: ${contract.contractNumber} error:${JSON.stringify(
          e.response,
        )}`,
      );
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
  }

  async canExecute(identity: Identity, request: GetSplitCommands): Promise<boolean> {
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
