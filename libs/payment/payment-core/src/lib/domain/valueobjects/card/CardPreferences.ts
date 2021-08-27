import { PublicProperties } from '@oney/common-core';
import { AtmWeeklyAllowanceLimit } from './AtmWeeklyAllowanceLimit';
import { MonthlyAllowanceLimit } from './MonthlyAllowanceLimit';
import { UpdatableCardPreferences } from '../../types/UpdatableCardPreferences';

export class CardPreferences implements UpdatableCardPreferences {
  blocked: boolean;

  foreignPayment: boolean;

  internetPayment: boolean;

  private _atmWeeklyAllowance: AtmWeeklyAllowanceLimit;

  private _monthlyAllowance: MonthlyAllowanceLimit;

  atmWeeklyUsedAllowance: number;

  monthlyUsedAllowance: number;

  public get atmWeeklyAllowance(): number {
    return this._atmWeeklyAllowance.value;
  }

  public get monthlyAllowance(): number {
    return this._monthlyAllowance.value;
  }

  constructor(cardPreferences: PublicProperties<CardPreferences>) {
    const { atmWeeklyAllowance, monthlyAllowance, ...otherPreferences } = cardPreferences;
    Object.assign(this, otherPreferences);
    this._atmWeeklyAllowance = new AtmWeeklyAllowanceLimit(atmWeeklyAllowance);
    this._monthlyAllowance = new MonthlyAllowanceLimit(monthlyAllowance);
  }

  /* istanbul ignore next: This function is used by the express serializer in order the return a properly formatted body.Can't be tested because we have no integration tests */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON() {
    const { _atmWeeklyAllowance, _monthlyAllowance, ...otherProperties } = this;
    return {
      ...otherProperties,
      atmWeeklyAllowance: _atmWeeklyAllowance.value,
      monthlyAllowance: _monthlyAllowance.value,
    };
  }

  updatePreferences(newPreferences: UpdatableCardPreferences): void {
    this.blocked = newPreferences.blocked !== undefined ? newPreferences.blocked : this.blocked;
    this.foreignPayment =
      newPreferences.foreignPayment !== undefined ? newPreferences.foreignPayment : this.foreignPayment;
    this.internetPayment =
      newPreferences.internetPayment !== undefined ? newPreferences.internetPayment : this.internetPayment;
    this._atmWeeklyAllowance =
      !!newPreferences.atmWeeklyAllowance || newPreferences.atmWeeklyAllowance === 0
        ? new AtmWeeklyAllowanceLimit(newPreferences.atmWeeklyAllowance)
        : this._atmWeeklyAllowance;
    this._monthlyAllowance =
      !!newPreferences.monthlyAllowance || newPreferences.monthlyAllowance === 0
        ? new MonthlyAllowanceLimit(newPreferences.monthlyAllowance)
        : this._monthlyAllowance;
  }
}
