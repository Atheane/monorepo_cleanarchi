import { PaymentExecution, PaymentStatus } from '@oney/common-adapters';
import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import {
  BankAccountGateway,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { CreditGateway } from '../../domain/gateways/CreditGateway';
import { PaymentIdentifier } from '../../PaymentIdentifier';

export interface UpdateTechnicalLimitCommandSplitContract {
  funding: number;
  firstPayment: number;
  fees: number;
}
export class UpdateTechnicalLimitCommand {
  uid: string;
  contract?: UpdateTechnicalLimitCommandSplitContract;
  useContract?: boolean;
}

@injectable()
export class UpdateTechnicalLimit implements Usecase<UpdateTechnicalLimitCommand, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.creditGateway) private readonly _creditGateway: CreditGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(SymLogger) private readonly logger: Logger,
  ) {}

  async execute(command: UpdateTechnicalLimitCommand): Promise<BankAccount> {
    const { uid } = command;
    const bankAccountToUseForCalculation = await this._bankAccountRepositoryRead.findById(command.uid);
    const currentTechnicalLimit = bankAccountToUseForCalculation.getTechnicalLimit();
    this.logger.info(`Current technical: ${currentTechnicalLimit} uid: ${uid}`);

    if (!command.useContract || !currentTechnicalLimit) {
      this.logger.info(`Calculating technical for current month, uid: ${uid}`);

      const previsionalTotalOfPaymentsForCurrentMonth = await this.getTotalOfPaymentsForCurrentMonth(uid);
      this.logger.info(`Using total payments current month: ${previsionalTotalOfPaymentsForCurrentMonth}`);
      bankAccountToUseForCalculation.calculateMonthlyTechnicalLimit(
        previsionalTotalOfPaymentsForCurrentMonth,
      );
    } else {
      this.logger.info(`Calculating technical limit using contract`);
      const { firstPayment, fees, funding: fundingAmount } = command.contract;
      bankAccountToUseForCalculation.calculateTechnicalLimitPostSingleSplitContract(
        fundingAmount,
        firstPayment,
        fees,
      );
    }

    this.logger.info(`Saving technical limit: ${bankAccountToUseForCalculation.getTechnicalLimit()}`);
    await this._bankAccountGateway.updateTechnicalLimitGlobalOut(bankAccountToUseForCalculation);
    const bankAccountSaved = await this._bankAccountRepositoryWrite.save(bankAccountToUseForCalculation);
    await this._eventDispatcher.dispatch(bankAccountToUseForCalculation);

    return bankAccountSaved;
  }

  async getTotalOfPaymentsForCurrentMonth(uid: string): Promise<number> {
    const allComingSplitPayments = await this._creditGateway.getDetails(uid);
    const validSplitPaymentContracts = allComingSplitPayments.filter(
      contract => contract.paymentScheduleExecution && contract.paymentScheduleExecution.length > 0,
    );
    let splitPaymentsOfCurrentMonth: PaymentExecution[] = [];
    for (const contract of validSplitPaymentContracts) {
      const comingUnpaidSplitPayments = contract.paymentScheduleExecution.filter(
        schedule => schedule && schedule.status === PaymentStatus.TODO,
      );

      const unpaidSplitPaymentsForThisMonth = this.getUnpaidSplitPaymentsOfCurrentMonth(
        comingUnpaidSplitPayments,
      );

      splitPaymentsOfCurrentMonth = splitPaymentsOfCurrentMonth.concat(unpaidSplitPaymentsForThisMonth);
    }

    this.logger.info(
      `Using current month split payments : ${JSON.stringify(splitPaymentsOfCurrentMonth)}, uid: ${uid}`,
    );
    const amountsOfAllSplitPaymentForThisMonth = splitPaymentsOfCurrentMonth.map(split => split.amount);
    return amountsOfAllSplitPaymentForThisMonth.reduce((previous, current) => previous + current, 0);
  }

  getUnpaidSplitPaymentsOfCurrentMonth(splitPayments: PaymentExecution[]): PaymentExecution[] {
    return splitPayments.filter(splitPayment => {
      const MONTH_INDEX = 1;
      const dueDateOfSplitPayment = new Date(splitPayment.dueDate);
      const dueDateMonthOfSplitPayment = dueDateOfSplitPayment.getMonth() + MONTH_INDEX;
      const dueDateYearOfSplitPayment = dueDateOfSplitPayment.getFullYear();

      const currentDate = new Date();
      const currentMounth = currentDate.getMonth() + MONTH_INDEX;
      const currentYear = currentDate.getFullYear();

      return dueDateMonthOfSplitPayment === currentMounth && dueDateYearOfSplitPayment === currentYear;
    });
  }
}
