import { Mapper } from '@oney/common-core';
import { BankAccount, BankConnection } from '@oney/aggregation-core';
import { injectable } from 'inversify';
import { IBankAccountPP2Reve } from '../dto/IBankAccountPP2Reve';

@injectable()
export class PP2ReveTransactionMapper
  implements Mapper<{ bankAccount: BankAccount; bankConnection: BankConnection }> {
  fromDomain({
    bankAccount,
    bankConnection,
  }: {
    bankAccount: BankAccount;
    bankConnection: BankConnection;
  }): IBankAccountPP2Reve {
    const {
      metadatas: { iban },
      ownerIdentity,
      transactions,
      usage,
      type,
      ownership,
    } = bankAccount.props;
    const responseDTO: IBankAccountPP2Reve = {
      connectionRefId: bankConnection.props.refId,
      connectionDate: bankConnection.props.connectionDate,
      usage,
      type,
      ownership,
      transactions: transactions.map(transaction => transaction.props),
    };
    responseDTO.iban = iban;
    responseDTO.fullName = ownerIdentity?.identity;
    return responseDTO;
  }
}
