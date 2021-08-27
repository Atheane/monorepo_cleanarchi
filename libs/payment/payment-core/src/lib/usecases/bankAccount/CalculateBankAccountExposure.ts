import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountBalanceGateway } from '../../domain/gateways/BankAccountBalanceGateway';
import { AccountBalance } from '../../domain/types/AccountBalance';
import { BankAccountExposureGateway } from '../../domain/gateways/BankAccountExposureGateway';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { ExposureError, NetworkError } from '../../models/errors/PaymentErrors';
import { Exposure } from '../../domain/valueobjects/Exposure';
import { ExposureFormulaConfig } from '../../domain/types/ExposureFormulaConfig';

interface CalculateBankAccountExposureCommand {
  uid: string;
}

@injectable()
export class CalculateBankAccountExposure implements Usecase<CalculateBankAccountExposureCommand, Exposure> {
  constructor(
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountBalanceGateway)
    private readonly bankAccountBalanceGateway: BankAccountBalanceGateway,
    @inject(PaymentIdentifier.bankAccountExposureGateway)
    private readonly bankAccountExposureGateway: BankAccountExposureGateway,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {}

  async execute({ uid }: CalculateBankAccountExposureCommand): Promise<Exposure> {
    try {
      const bankAccountToUseForCalculation: BankAccount = await this._bankAccountRepositoryRead.findById(uid);
      let bankAccountExposure: Exposure = { amount: 0 };
      const { balance }: AccountBalance = await this.bankAccountBalanceGateway.getBalance(
        bankAccountToUseForCalculation.props.uid,
      );
      const currencyUnitAmountInEuros = balance / 100;

      if (bankAccountToUseForCalculation.isSplitPaymentEligibilityGranted()) {
        this.logger.info(`Computing exposure amount using balance: ${currencyUnitAmountInEuros}`);
        bankAccountExposure = bankAccountToUseForCalculation.calculateExposure({
          balance: currencyUnitAmountInEuros,
          feeRateOfSplitPayment: ExposureFormulaConfig.FEE_RATE_OF_SPLIT_PAYMENT,
          maxFeeAmountOfSplitPayment: ExposureFormulaConfig.MAX_FEE_AMOUNT_OF_SPLIT_PAYMENT,
          minPurchaseAmountToAllowSplitPayment:
            ExposureFormulaConfig.MIN_PURCHASE_AMOUNT_TO_ALLOW_SPLIT_PAYMENT,
        });
      }

      bankAccountToUseForCalculation.updateExposure(bankAccountExposure, currencyUnitAmountInEuros);

      this.logger.info(`Updating exposure amount: ${bankAccountExposure.amount} for user: ${uid}`);
      await this.bankAccountExposureGateway.updateBankAccountExposure(bankAccountToUseForCalculation);
      await this._eventDispatcher.dispatch(bankAccountToUseForCalculation);
      return bankAccountExposure;
    } catch (e) {
      if (e instanceof NetworkError.ApiResponseError) {
        throw new ExposureError.ExposureSyncFailure(e);
      }
      throw e;
    }
  }
}
