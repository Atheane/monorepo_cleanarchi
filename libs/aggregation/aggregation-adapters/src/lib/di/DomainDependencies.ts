import {
  AggregateAccounts,
  BankAccountGateway,
  BankConnectionGateway,
  BankConnectionRepository,
  UserRepository,
  CompleteSignInWithSca,
  CreditDecisioningService,
  GetAccountsByConnectionId,
  GetAllBankAccounts,
  GetAllBanks,
  GetAllTransactions,
  GetBankById,
  GetConnectionById,
  GetConnectionsOwnedByUser,
  GetTransactionsByConnectionId,
  GetUserCreditProfile,
  PostAllTransactions,
  SignIn,
  SynchronizeConnection,
  TriggerSca,
  DeleteBankConnection,
  UpdateConnection,
  DeleteUser,
  GetTerms,
  SaveUserConsent,
  CheckUserConsent,
  ScaConnectionGateway,
  BankAccountRepository,
  SendUserRevenueDataToUpcapLimit,
  UploadUserDataToCreditDecisioningPartner,
  GetCategorizedTransactions,
} from '@oney/aggregation-core';
import {
  BankMapper,
  BankConnectionMapper,
  ConnectionStateMapper,
  BankAccountMapper,
  BudgetInsightBankAccountTypeMapper,
  BudgetInsightTransactionMapper,
  AlgoanBankAccountTypeMapper,
  AlgoanTransactionMapper,
  CreditProfileMapper,
  OwnerIdentityMapper,
  BIBankAccountGateway,
} from '../adapters';

export interface DomainDependencies {
  // usecases
  getAllBanks: GetAllBanks;
  getBankById: GetBankById;
  signIn: SignIn;
  getAllBankAccounts: GetAllBankAccounts;
  getAccountsByConnectionId: GetAccountsByConnectionId;
  completeSignInWithSca: CompleteSignInWithSca;
  synchronizeConnection: SynchronizeConnection;
  getConnectionById: GetConnectionById;
  aggregateAccounts: AggregateAccounts;
  triggerSca: TriggerSca;
  getConnectionsOwnedByUser: GetConnectionsOwnedByUser;
  getTransactionsByConnectionId: GetTransactionsByConnectionId;
  getAllTransactions: GetAllTransactions;
  postAllTransactions: PostAllTransactions;
  getUserCreditProfile: GetUserCreditProfile;
  updateConnection: UpdateConnection;
  deleteUser: DeleteUser;
  deleteBankConnection: DeleteBankConnection;
  getTerms: GetTerms;
  saveUserConsent: SaveUserConsent;
  checkUserConsent: CheckUserConsent;
  uploadUserDataToCreditDecisioningPartner: UploadUserDataToCreditDecisioningPartner;
  sendUserRevenueDataToUpcapLimit: SendUserRevenueDataToUpcapLimit;
  getCategorizedTransactions: GetCategorizedTransactions;
  // mappers
  mappers: {
    bankMapper: BankMapper;
    bankConnectionMapper: BankConnectionMapper;
    connectionStateMapper: ConnectionStateMapper;
    bankAccountMapper: BankAccountMapper;
    budgetInsightBankAccountTypeMapper: BudgetInsightBankAccountTypeMapper;
    budgetInsightTransactionMapper: BudgetInsightTransactionMapper;
    algoanBankAccountTypeMapper: AlgoanBankAccountTypeMapper;
    algoanTransactionMapper: AlgoanTransactionMapper;
    creditProfileMapper: CreditProfileMapper;
    ownerIdentityMapper: OwnerIdentityMapper;
  };
  // gateways
  bankConnectionGateway: BankConnectionGateway;
  biBankAccountGateway: BIBankAccountGateway;
  bankAccountGateway: BankAccountGateway;
  scaConnectionGateway: ScaConnectionGateway;
  // repositories
  userRepository: UserRepository;
  bankConnectionRepository: BankConnectionRepository;
  bankAccountRepository: BankAccountRepository;
  // services
  creditDecisioningService: CreditDecisioningService;
}
