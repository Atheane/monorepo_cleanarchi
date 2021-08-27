import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { ContractStatus } from '@oney/credit-messages';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { SplitPaymentSchedule } from '../../domain/entities';
import { SplitContractRepository, SplitPaymentScheduleRepository } from '../../domain/repositories';
import { SplitCreditDetails } from '../../domain/types/split';

export interface CreditGetAllSplitContractCommands {
  status?: ContractStatus[];
}

@injectable()
export class CreditGetAllSplitContract
  implements Usecase<CreditGetAllSplitContractCommands, Promise<SplitCreditDetails[]>> {
  constructor(
    @inject(CreditIdentifiers.splitContractRepository)
    private readonly contractRepository: SplitContractRepository,
    @inject(CreditIdentifiers.splitPaymentScheduleRepository)
    private readonly paymentScheduleRepository: SplitPaymentScheduleRepository,
  ) {}

  async execute(request: CreditGetAllSplitContractCommands): Promise<SplitCreditDetails[]> {
    const contracts = await this.contractRepository.getAll(request.status);

    const result = contracts.map(
      async (contract): Promise<SplitCreditDetails> => {
        const paid = [ContractStatus.PAID, ContractStatus.PAID_ANTICIPATED, ContractStatus.CANCELED];
        let paymentSchedule: SplitPaymentSchedule;
        try {
          if (!paid.includes(contract.status)) {
            paymentSchedule = new SplitPaymentSchedule(
              await this.paymentScheduleRepository.getByContractNumber(contract.contractNumber),
            );
          }
        } catch (e) {
          //
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

  async canExecute(identity: Identity): Promise<boolean> {
    const scope =
      identity && identity.roles && identity.roles.find(item => item.scope.name === ServiceName.credit);
    return (
      scope && scope.permissions.read === Authorization.all && identity.provider === IdentityProvider.azure
    );
  }
}
