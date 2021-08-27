import { AggregateRoot, Handle } from '@oney/ddd';
import {
  AccountEligibilityCalculated,
  AccountEligibilityCalculatedProps,
  AggregatedAccountsIncomesChecked,
  AggregatedAccountsIncomesCheckedProps,
  CustomBalanceLimitCalculated,
  CustomBalanceLimitCalculatedProps,
  PreEligibilityOK,
  PreEligibilityOKProps,
  X3X4EligibilityCalculated,
  X3X4EligibilityCalculatedProps,
} from '@oney/cdp-messages';

export interface ClientProperties {
  userId: string;
  accountEligibility?: AccountEligibilityCalculatedProps;
  X3X4Eligibility?: X3X4EligibilityCalculatedProps;
  preEligibilityOK?: PreEligibilityOKProps;
  customBalanceLimit?: CustomBalanceLimitCalculatedProps;
  aggregatedAccountsIncomes?: AggregatedAccountsIncomesCheckedProps;
}

export class Client extends AggregateRoot<ClientProperties> {
  public props: ClientProperties;

  constructor(props: ClientProperties) {
    super(props.userId);
    this.props = props;
  }

  setAccountEligibility(props: AccountEligibilityCalculatedProps): void {
    this.applyChange(new AccountEligibilityCalculated(props));
  }

  @Handle(AccountEligibilityCalculated)
  applyAccountEligibility({ props }: AccountEligibilityCalculated): void {
    this.props.accountEligibility = props;
  }

  setX3X4Eligibility(props: X3X4EligibilityCalculatedProps): void {
    this.applyChange(new X3X4EligibilityCalculated(props));
  }

  @Handle(X3X4EligibilityCalculated)
  applyX3X4EligibilityCalculated({ props }: X3X4EligibilityCalculated): void {
    this.props.X3X4Eligibility = props;
  }

  setPreEligibilityOK(props: PreEligibilityOKProps): void {
    this.applyChange(new PreEligibilityOK(props));
  }

  @Handle(PreEligibilityOK)
  applyPreEligibilityOK({ props }: PreEligibilityOK): void {
    this.props.preEligibilityOK = props;
  }

  setCustomerBalanceLimit(props: CustomBalanceLimitCalculatedProps): void {
    this.applyChange(new CustomBalanceLimitCalculated(props));
  }

  @Handle(CustomBalanceLimitCalculated)
  applyCustomerBalanceLimit({ props }: CustomBalanceLimitCalculated): void {
    this.props.customBalanceLimit = props;
  }

  setAggregatedAccountsIncomes(props: AggregatedAccountsIncomesCheckedProps): void {
    this.applyChange(new AggregatedAccountsIncomesChecked(props));
  }

  @Handle(AggregatedAccountsIncomesChecked)
  applyAggregatedAccountsIncomes({ props }: AggregatedAccountsIncomesChecked): void {
    this.props.aggregatedAccountsIncomes = props;
  }
}
