import { DeclarativeFiscalSituation, FiscalReference, ProfileInfos } from '@oney/profile-messages';
import { GatewayMonthlyAllowance } from './GatewayMonthlyAllowance';
import { BankAccount } from '../aggregates/BankAccount';
import { BankAccountUpdatable } from '../types/BankAccountUpdatable';
import { LimitInformation } from '../valueobjects/bankAccount/LimitInformation';
import { BeneficiaryProperties } from '../entities/Beneficiary';

export interface BankAccountGateway {
  isOneyBankAccount(userId: string, bankAccountId: string): Promise<string>;
  getBankAccount(uid: string): Promise<BankAccount>;
  updateBankAccount(uid: string, updatable: BankAccountUpdatable): Promise<void>;
  updateFatca(uid: string, fiscalReference: FiscalReference): Promise<void>;
  getCalculatedMonthlyAllowance(uid: string): Promise<GatewayMonthlyAllowance>;
  upsert(profile: ProfileInfos): Promise<BankAccount>;
  updateDeclarativeFiscalSituation(
    uid: string,
    declarativeFiscalSituation: DeclarativeFiscalSituation,
  ): Promise<void>;
  updateLimitInformation(userId: string, limitInformation: LimitInformation): Promise<void>;
  updateTechnicalLimitGlobalOut(bankAccount: BankAccount): Promise<void>;
  addBeneficiary(
    ownerId: string,
    beneficiaryProperties: Omit<BeneficiaryProperties, 'id' | 'status'>,
  ): Promise<BeneficiaryProperties>;
}
