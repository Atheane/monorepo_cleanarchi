import {
  AccountMonthlyAllowance,
  BankAccount,
  BankAccountGateway,
  BankAccountUpdatable,
  NetworkProvider,
  LimitInformation,
  BeneficiaryProperties,
  GatewayMonthlyAllowance,
} from '@oney/payment-core';
import { injectable } from 'inversify';
import { DeclarativeFiscalSituation, FiscalReference, ProfileInfos } from '@oney/profile-messages';
import { subtract } from '@oney/common-core';
import { BankAccountAllowanceMapper } from '../mappers/BankAccountAllowanceMapper';
import { SmoneyCreateBankAccountMapper } from '../mappers/SmoneyCreateBankAccountMapper';
import { SmoneyFatcaMapper } from '../mappers/SmoneyFatcaMapper';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';
import { LimitInformationMapper } from '../mappers/LimitInformationMapper';
import { SmoneyGetBankAccountMapper } from '../mappers/SmoneyGetBankAccountMapper';
import { SmoneyUpdateLimitGlobalOut } from '../partners/smoney/models/bankAccount/LimitInformationRequest';
import { SmoneyAddBeneficiaryMapper } from '../mappers/SmoneyAddBeneficiaryMapper';

@injectable()
export class SmoneyBankAccountGateway implements BankAccountGateway {
  private readonly _smoneyAddBeneficiaryMapper: SmoneyAddBeneficiaryMapper;

  constructor(
    private readonly _networkProvider: NetworkProvider<SmoneyApi>,
    private readonly smoneyBic: string,
  ) {
    this._smoneyAddBeneficiaryMapper = new SmoneyAddBeneficiaryMapper();
  }

  async isOneyBankAccount(userId: string, bankAccountId: string): Promise<string> {
    const result = await this._networkProvider.api().smoneyBankAccountApi.getBankAccountDetail({
      smoneyId: userId,
      bankAccountId,
    });
    if (result.Bic === this.smoneyBic) {
      return result.Iban;
    }
    return null;
  }

  async getBankAccount(uid: string): Promise<BankAccount> {
    const smoneyGetBankAccountMapper = new SmoneyGetBankAccountMapper(this.smoneyBic);
    const data = await this._networkProvider.api().smoneyUserApi.getUserInfos({ appUserId: uid });
    return smoneyGetBankAccountMapper.toDomain(data);
  }

  async updateBankAccount(uid: string, updatable: BankAccountUpdatable): Promise<void> {
    await this._networkProvider.api().smoneyUserApi.updateUser(uid, {
      Profile: {
        Phonenumber: updatable.phone,
      },
    });
  }

  async updateFatca(uid: string, fiscalReference: FiscalReference): Promise<void> {
    await this._networkProvider
      .api()
      .smoneyUserApi.updateFatca(uid, new SmoneyFatcaMapper().fromDomain(fiscalReference));
  }

  async updateDeclarativeFiscalSituation(
    uid: string,
    declarativeFiscalSituation: DeclarativeFiscalSituation,
  ): Promise<void> {
    await this._networkProvider
      .api()
      .smoneyUserApi.updateDeclarativeFiscalSituation(uid, declarativeFiscalSituation);
  }

  async upsert(profile: ProfileInfos): Promise<BankAccount> {
    const smoneyCreateBankAccountMapper = new SmoneyCreateBankAccountMapper();
    try {
      const result = await this._networkProvider
        .api()
        .smoneyUserApi.createUser(smoneyCreateBankAccountMapper.fromDomain(profile));
      return smoneyCreateBankAccountMapper.toDomain({ raw: result, bic: this.smoneyBic });
    } catch (err) {
      const result = await this._networkProvider
        .api()
        .smoneyUserApi.updateUser(profile.uid, smoneyCreateBankAccountMapper.fromDomain(profile));
      return smoneyCreateBankAccountMapper.toDomain({ raw: result, bic: this.smoneyBic });
    }
  }

  private async getMonthlyAllowance(uid: string): Promise<AccountMonthlyAllowance> {
    const data = await this._networkProvider.api().smoneyAllowanceApi.getLimits({ appUserId: uid });
    const monthlyAllowance = new BankAccountAllowanceMapper().toDomain({
      ...data,
      uid,
    });
    return monthlyAllowance;
  }

  async getCalculatedMonthlyAllowance(uid: string): Promise<GatewayMonthlyAllowance> {
    const smoneyMonthlyAllowance = await this.getMonthlyAllowance(uid);
    const remainingFundToSpend = subtract(
      smoneyMonthlyAllowance.monthlyAuthorizedAllowance,
      smoneyMonthlyAllowance.monthlyUsedAllowance,
    );

    return {
      authorizedAllowance: smoneyMonthlyAllowance.monthlyAuthorizedAllowance,
      monthlyUsedAllowance: smoneyMonthlyAllowance.monthlyUsedAllowance,
      remainingFundToSpend,
    };
  }

  async updateLimitInformation(userId: string, limitInformation: LimitInformation): Promise<void> {
    const mapper: LimitInformationMapper = new LimitInformationMapper();
    await this._networkProvider.api().smoneyUserApi.updateLimit(userId, mapper.fromDomain(limitInformation));
  }

  async updateTechnicalLimitGlobalOut(bankAccount: BankAccount): Promise<void> {
    const appUserId = bankAccount.props.uid;
    const technicalLimit = bankAccount.props.limits.props.technicalLimit;
    const annualAllowance = bankAccount.props.limits.props.globalOut.annualAllowance;

    const annualAllowanceInCentsUnit = annualAllowance * 100;
    const technicalLimitInCentsUnit = technicalLimit * 100;

    const limitsGlobalOut: SmoneyUpdateLimitGlobalOut = {
      GlobalOut: {
        AnnualAllowance: annualAllowanceInCentsUnit,
        MonthlyAllowance: technicalLimitInCentsUnit,
        WeeklyAllowance: technicalLimitInCentsUnit,
      },
    };
    await this._networkProvider.api().smoneyUserApi.updateLimitGlobalOut(appUserId, limitsGlobalOut);
  }

  async addBeneficiary(
    ownerId: string,
    beneficiaryProperties: Omit<BeneficiaryProperties, 'id' | 'status'>,
  ): Promise<BeneficiaryProperties> {
    const addBeneficiaryResponse = await this._networkProvider.api().smoneyUserApi.addBeneficiary({
      uid: ownerId,
      DisplayName: beneficiaryProperties.name,
      Bic: beneficiaryProperties.bic,
      Iban: beneficiaryProperties.iban,
      IsMine: false,
    });

    return this._smoneyAddBeneficiaryMapper.toDomain({
      response: addBeneficiaryResponse,
      email: beneficiaryProperties.email,
    });
  }
}
