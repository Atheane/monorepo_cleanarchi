import { DateTime, Duration } from 'luxon';
import { ScheduleKey, SplitProduct } from '@oney/credit-messages';
import { SplitSimulationProperties } from '../types/split/SplitSimulationProperties';
import { IAppConfiguration } from '../models/IAppConfiguration';

export class SplitCalculator {
  public readonly configuration: IAppConfiguration;

  constructor(configuration: IAppConfiguration) {
    this.configuration = configuration;
  }

  simulate(
    fundingAmount: number,
    productCode: SplitProduct,
  ): Pick<
    SplitSimulationProperties,
    'fundingAmount' | 'fee' | 'apr' | 'immediatePayments' | 'deferredPayments'
  > {
    const {
      x3FeesRate,
      x3SplitFeesMaximumThreshold,
      x4FeesRate,
      x4SplitFeesMaximumThreshold,
    } = this.configuration.calculatorConfiguration;

    switch (productCode) {
      case SplitProduct.DF003:
        return this.simulateXsplit(fundingAmount, 3, x3FeesRate, x3SplitFeesMaximumThreshold);
      case SplitProduct.DF004:
        return this.simulateXsplit(fundingAmount, 4, x4FeesRate, x4SplitFeesMaximumThreshold);
      default:
        return null;
    }
  }

  private simulateXsplit(
    fundingAmount: number,
    duration: number,
    feeRate: number,
    splitFeesMaximumThreshold: number,
  ): Pick<
    SplitSimulationProperties,
    'fundingAmount' | 'fee' | 'apr' | 'immediatePayments' | 'deferredPayments'
  > {
    const today = DateTime.utc();
    const effectiveFeeRate = this.calculateEffectiveFeesRate(
      fundingAmount,
      feeRate,
      splitFeesMaximumThreshold,
    );
    const fee = this.calculateFee(fundingAmount, effectiveFeeRate);
    const monthlyAmount = this.calculateMonthlyAmount(fundingAmount, duration);
    const lastMonthlyAmount = this.calculateLastMonthlyAmount(fundingAmount, duration);

    const simulation: Pick<
      SplitSimulationProperties,
      'fundingAmount' | 'fee' | 'apr' | 'immediatePayments' | 'deferredPayments'
    > = {
      fundingAmount,
      fee,
      apr: this.calculateApr(duration, effectiveFeeRate),
      immediatePayments: [
        {
          key: ScheduleKey.FEE,
          amount: fee,
          dueDate: today.toJSDate(),
        },
        {
          key: ScheduleKey.M1,
          amount: monthlyAmount,
          dueDate: today.toJSDate(),
        },
      ],
      deferredPayments: [],
    };

    for (let i = 2; i <= duration; i += 1) {
      simulation.deferredPayments.push({
        key: ScheduleKey[`M${i.toString()}`],
        amount: i === duration ? lastMonthlyAmount : monthlyAmount,
        dueDate: today.plus(Duration.fromISO(`P${i - 1}M`)).toJSDate(),
      });
    }

    return simulation;
  }

  private calculateApr(duration: number, feeRate: number): number {
    let apr = 0;
    let van = this.vanCredit(duration, apr, feeRate);
    const step = 0.00001;

    while (Math.abs(van) > step) {
      apr -= van * (step / (this.vanCredit(duration, apr + step, feeRate) - van));
      van = this.vanCredit(duration, apr, feeRate);
    }

    return parseFloat(apr.toFixed(4));
  }

  private vanCredit(duration: number, apr: number, feeRate: number): number {
    let van = (duration - 1) / duration - feeRate;

    for (let i = 1; i < duration; i += 1) {
      van -= (1 / duration) * (1 / (1 + apr) ** (i / 12));
    }
    return van;
  }

  private calculateEffectiveFeesRate(fundingAmount: number, feeRate: number, threshold: number): number {
    return Math.min(feeRate * fundingAmount, threshold) / fundingAmount;
  }

  private calculateFee(fundingAmount: number, effectiveFeeRate: number): number {
    return parseFloat((fundingAmount * effectiveFeeRate).toFixed(2));
  }

  private calculateMonthlyAmount(fundingAmount: number, duration: number): number {
    return parseFloat((fundingAmount / duration).toFixed(2));
  }

  private calculateLastMonthlyAmount(fundingAmount: number, duration: number): number {
    return parseFloat(
      (fundingAmount - this.calculateMonthlyAmount(fundingAmount, duration) * (duration - 1)).toFixed(2),
    );
  }
}
