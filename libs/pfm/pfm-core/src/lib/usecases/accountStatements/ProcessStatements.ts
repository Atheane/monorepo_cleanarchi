import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import { Usecase } from '@oney/ddd';
import { ApiProvider, TransactionSource } from '@oney/common-core';
import { ServiceApi } from '@oney/common-adapters';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import {
  AccountStatementRepository,
  BankAccountRepository,
  UserRepository,
  IAppConfiguration,
  AccountStatement,
  AmountPositive,
  BusDelivery,
  State,
} from '../../domain';

export interface ProcessStatementsCommands {
  date: Date;
  userIds?: string[];
  regenerate?: boolean;
}

@injectable()
export class ProcessStatements implements Usecase<ProcessStatementsCommands, void> {
  constructor(
    @inject(PfmIdentifiers.userRepository) private readonly userRepository: UserRepository,
    @inject(PfmIdentifiers.accountStatementRepository)
    private readonly accountStatementRepository: AccountStatementRepository,
    @inject(EncodeIdentity) private readonly _encodeIdentity: EncodeIdentity,
    @inject(PfmIdentifiers.serviceApiProvider) private readonly _serviceApiProvider: ApiProvider<ServiceApi>,
    @inject(PfmIdentifiers.smoneyBankAccountRepository)
    private readonly smoneyBankAccountRepository: BankAccountRepository,
    @inject(PfmIdentifiers.busDelivery) private readonly busDelivery: BusDelivery,
    @inject(PfmIdentifiers.configuration) private readonly appConfiguration: IAppConfiguration,
  ) {}

  async execute(request: ProcessStatementsCommands): Promise<void> {
    const targetMonth = moment(request.date);
    const dateFrom = targetMonth.startOf('month').toDate();
    const dateTo = targetMonth.endOf('month').toDate();

    let userIds = request.userIds;
    if (!userIds?.length) {
      const verifiedUser = await this.userRepository.getAllVerifiedUser();
      userIds = verifiedUser.map(user => user.uid);
    }

    await Promise.all(
      userIds.map(async uid => {
        if (!request.regenerate) {
          const statementAlreadyExists: boolean = await this.accountStatementRepository.exists(uid, dateTo);
          if (statementAlreadyExists) {
            console.log(`Account statement already exist for uid: ${uid} dateTo: ${dateTo.toISOString()}`);
            return Promise.resolve();
          }
        }

        const holder = await this._encodeIdentity.execute({
          uid,
          email: 'fake.email@oney.fr',
          provider: IdentityProvider.odb,
        });
        try {
          const userBankAccount = await this.smoneyBankAccountRepository.getAll(uid);
          const transactions = await this._serviceApiProvider
            .api()
            .pfm.getAllTransaction({ uid, holder, query: { transactionSources: [TransactionSource.ODB] } });
          const credits = await this._serviceApiProvider.api().credit.getSplitContracts({ uid, holder });
          if (!userBankAccount.length) {
            console.error('Cannot get user bank account');
            return;
          }

          const statement = new AccountStatement({
            currentBalance: new AmountPositive(userBankAccount[0].balance.value),
            dateFrom,
            dateTo,
            uid,
            transactions: transactions.data,
            credits: (credits || []).map(c => {
              const credit = {
                initialTransactionId: c.initialTransactionId,
                transactionIds: {},
              };
              credit.transactionIds[c.initialTransactionId] = {
                key: 'initial',
                contractNumber: c.contractNumber,
              };
              (c.paymentScheduleExecution || []).map(s => {
                if (s?.transactionId) {
                  credit.transactionIds[s.transactionId] = {
                    key: s.key,
                    contractNumber: c.contractNumber,
                    productCode: c.productCode,
                  };
                }
              });
              return credit;
            }),
          });

          const statementState = new State(statement, transactions.data, dateFrom, dateTo);
          statement.state = statementState.value;
          statement.documentStateError = statementState.balance;

          const result = await this.accountStatementRepository.save(statement.props);
          await this.busDelivery.send(this.appConfiguration.eventsConfig.generatedStatementTopic, result);
          console.log(`Account statement generated for uid: ${uid} dateTo: ${dateTo.toISOString()}`);
        } catch (err) {
          console.log(err);
        }
      }),
    );

    return;
  }
}
