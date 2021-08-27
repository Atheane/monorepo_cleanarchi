import { BankConnection, Bank } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { BankAccountMapper } from './BankAccountMapper';
import { BankMapper } from '../../bank/mappers';
import { IBankConnection, IBankConnectionWithBankAndAccount } from '../dto/IBankConnection';

@injectable()
export class BankConnectionMapper implements Mapper<BankConnection> {
  constructor(
    private readonly bankAccountMapper: BankAccountMapper,
    private readonly bankMapper: BankMapper,
  ) {}
  fromDomain(bankConnection: BankConnection): IBankConnection {
    const banConnectionDto: IBankConnection = {
      connectionId: bankConnection.props.connectionId,
      bankId: bankConnection.props.bankId,
      refId: bankConnection.props.refId,
      userId: bankConnection.props.userId,
      state: bankConnection.props.state,
      active: bankConnection.props.active,
      form: bankConnection.props.form,
    };
    return banConnectionDto;
  }
  fromDomainWithBankAndAccount({
    bankConnection,
    bank,
  }: {
    bankConnection: BankConnection;
    bank: Bank;
  }): IBankConnectionWithBankAndAccount | false {
    const banConnectionDto: IBankConnectionWithBankAndAccount = {
      connectionId: bankConnection.props.connectionId,
      bankId: bankConnection.props.bankId,
      refId: bankConnection.props.refId,
      userId: bankConnection.props.userId,
      state: bankConnection.props.state,
      accounts: bankConnection.props.accounts.map(anAccount => this.bankAccountMapper.fromDomain(anAccount)),
      active: bankConnection.props.active,
      bank: this.bankMapper.fromDomainWithForm(bank),
    };
    return banConnectionDto.accounts.length > 0 && banConnectionDto;
  }
}
