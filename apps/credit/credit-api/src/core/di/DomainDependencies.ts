import { EncodeIdentity, RequestScaVerifier, VerifySca } from '@oney/identity-core';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import {
  SplitContractRepository,
  IdGenerator,
  SplitPaymentScheduleRepository,
  CheckUserId,
  GetTerms,
  SimulateSplit,
  ValidateSplitSimulation,
  CreateSplitContract,
  GetOneSplitContract,
  GetSplitContracts,
  GetPaymentSchedule,
  CreditGetAllSplitContract,
  CreateCreditor,
  UpdateCreditor,
  GetCreditor,
  IAppConfiguration,
} from '@oney/credit-core';

export interface DomainDependencies {
  configuration: IAppConfiguration;
  getTerms: GetTerms;
  simulateSplit: SimulateSplit;
  validateSplitSimulation: ValidateSplitSimulation;
  createSplitContract: CreateSplitContract;
  getOneSplitContract: GetOneSplitContract;
  getSplitContracts: GetSplitContracts;
  creditGetAllSplitContract: CreditGetAllSplitContract;
  checkUserId: CheckUserId;
  splitContractRepository: SplitContractRepository;
  splitPaymentScheduleRepository: SplitPaymentScheduleRepository;
  longIdGenerator: IdGenerator;
  getPaymentSchedule: GetPaymentSchedule;
  encodeIdentity: EncodeIdentity;
  expressAuthenticationMiddleware: ExpressAuthenticationMiddleware;
  verifySca: VerifySca;
  requestSca: RequestScaVerifier;
  createCreditor: CreateCreditor;
  updateCreditor: UpdateCreditor;
  getCreditor: GetCreditor;
}
