import { AggregateRoot, Handle } from '@oney/ddd';
import {
  BankConnectionDeleted,
  BankConnectionUpdated,
  ThirdPartyAuthFinished,
} from '@oney/aggregation-messages';
import { BankAccount } from './BankAccount';
import { ConnectionStateEnum, ConnectionState, BankField } from '../valueobjects';

export interface BankConnectionProperties {
  connectionId: string;
  userId: string;
  bankId: string;
  refId: string;
  active: boolean;
  state: ConnectionStateEnum;
  form?: BankField[];
  accounts?: BankAccount[];
  connectionDate: Date;
}

export class BankConnection extends AggregateRoot<BankConnectionProperties> {
  public props: BankConnectionProperties;

  constructor(props: BankConnectionProperties) {
    super(props.connectionId);
    this.props = props;
  }

  setBankAccounts(accounts: BankAccount[]): void {
    this.props.accounts = accounts;
  }

  finishThirdPartyAuth(_state: ConnectionStateEnum): void {
    const { userId } = this.props;
    const { state } = new ConnectionState(_state).value;
    this.props.state = state;
    this.applyChange(
      new ThirdPartyAuthFinished({
        state,
        userId,
      }),
    );
  }
  @Handle(ThirdPartyAuthFinished)
  applyThirdPartyAuthFinished({ props }: ThirdPartyAuthFinished): void {
    this.props.state = props.state;
  }

  updateConnection(_state: ConnectionStateEnum): void {
    const { userId, refId } = this.props;
    const { state } = new ConnectionState(_state).value;
    this.applyChange(
      new BankConnectionUpdated({
        state,
        userId,
        refId,
      }),
    );
  }

  @Handle(BankConnectionUpdated)
  applyBankConnectionUpdated({ props }: BankConnectionUpdated): void {
    this.props.state = props.state;
  }

  delete(): void {
    const { userId, refId } = this.props;
    const deletedAccountIds = this.props.accounts.map(account => account.id);
    this.applyChange(
      new BankConnectionDeleted({
        userId,
        deletedAccountIds,
        refId,
      }),
    );
  }
  @Handle(BankConnectionDeleted)
  applyBankConnectionDeleted(): void {
    this.props = undefined;
  }
}
