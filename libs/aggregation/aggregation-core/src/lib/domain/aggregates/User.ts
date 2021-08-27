import { AggregateRoot, Handle } from '@oney/ddd';
import { UserRevenueDataCalculated } from '@oney/aggregation-messages';
import { BankConnection } from './BankConnection';
import { BankAccount } from './BankAccount';
import { Transaction } from '../entities/Transaction';
import { SaveUserConsentCommand } from '../../usecases';
import { UserProvider, CreditProfile } from '../types';

export interface UserProperties {
  userId: string;
  consent: boolean;
  consentDate: Date;
  provider?: UserProvider; //TO_DO : is it necessary ?
  // Aggregation props
  credential?: string;
  bankConnections?: BankConnection[];
  aggregatedBankAccounts?: BankAccount[];
  // Credit Decisioning props
  creditDecisioningUserId?: string;
  creditProfile?: CreditProfile;
  unsavedTransactions?: Transaction[];
}

export class User extends AggregateRoot<UserProperties> {
  public props: UserProperties;

  constructor(props: UserProperties) {
    super(props.userId);
    this.props = props;
  }

  static create(cmd: SaveUserConsentCommand): User {
    return new User({ ...cmd, consentDate: new Date() });
  }

  update(partialProps: Partial<UserProperties>): void {
    this.props = {
      ...this.props,
      ...partialProps,
    };
  }

  calculateRevenueData(aggregatedBankAccounts: BankAccount[], creditProfile: CreditProfile): void {
    const accountProps = aggregatedBankAccounts.map(anAccount => ({
      id: anAccount.props.id,
      type: anAccount.props.type,
    }));
    this.applyChange(
      new UserRevenueDataCalculated({
        aggregatedBankAccounts: accountProps,
        ...creditProfile,
      }),
    );
  }

  @Handle(UserRevenueDataCalculated)
  applyUserRevenueDataCalculated({
    props: { creditScoring, creditInsights },
  }: UserRevenueDataCalculated): void {
    this.props = {
      ...this.props,
      creditProfile: {
        creditScoring,
        creditInsights,
      },
    };
  }

  delete(): void {
    this.props.bankConnections.forEach(bankConnection => {
      bankConnection.delete();
    });
  }
}
