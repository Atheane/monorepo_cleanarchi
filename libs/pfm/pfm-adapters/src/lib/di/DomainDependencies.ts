import {
  P2pRepository,
  AccountStatementRepository,
  GetTransactionById,
  GetAllBankAccounts,
  GetTransactionsByAccountId,
  GetAllTransactions,
  CreateP2p,
  GetListAccountStatements,
  GetOneAccountStatement,
  ProcessStatements,
  ProcessMonthlyStatements,
  UserRepository,
} from '@oney/pfm-core';
import {
  BankAccountMapper,
  TransactionMapper,
  AccountStatementMapper,
  BankAccountAggregationMapper,
  TransactionSMoneyMapper,
  UserMapper,
} from '../adapters/mappers';
import { GetTransactionsService } from '../adapters/services/GetTransactionsService';

export interface DomainDependencies {
  createP2p: CreateP2p;
  getAllBankAccounts: GetAllBankAccounts;
  getAllTransactions: GetAllTransactions;
  getTransactionsByAccountId: GetTransactionsByAccountId;
  getListAccountStatements: GetListAccountStatements;
  getOneAccountStatement: GetOneAccountStatement;
  getTransactionById: GetTransactionById;
  p2pRepository: P2pRepository;
  accountStatementRepository: AccountStatementRepository;
  userRepository: UserRepository;
  processStatements: ProcessStatements;
  processMonthlyStatements: ProcessMonthlyStatements;
  mappers: {
    bankAccountAggregationMapper: BankAccountAggregationMapper;
    transactionSMoneyMapper: TransactionSMoneyMapper;
    bankAccountMapper: BankAccountMapper;
    transactionMapper: TransactionMapper;
    accountStatementMapper: AccountStatementMapper;
    userMapper: UserMapper;
  };
  getTransactionService: GetTransactionsService;
}
