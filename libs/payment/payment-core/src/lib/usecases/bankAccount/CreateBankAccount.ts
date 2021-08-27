import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { KycDecisionType, ProfileInfos } from '@oney/profile-messages';
import { Logger, SymLogger } from '@oney/logger-core';
import { CreateBankAccountRequest } from './commands/CreateBankAccountRequest';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { GetProfileInformationGateway } from '../../domain/gateways/GetProfileInformationGateway';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';
import { KycGateway } from '../../domain/gateways/KycGateway';
import { StorageGateway } from '../../domain/gateways/StorageGateway';

@injectable()
export class CreateBankAccount implements Usecase<CreateBankAccountRequest, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountGateway) private readonly bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(PaymentIdentifier.kycGateway) private readonly _kycGateway: KycGateway,
    @inject(PaymentIdentifier.storageGateway) private readonly _storageGateway: StorageGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(PaymentIdentifier.featureFlagKycOnCreation) private readonly _featureFlagKycOnCreation: boolean,
    @inject(SymLogger) private readonly logger: Logger,
  ) {}

  async execute(request: CreateBankAccountRequest): Promise<BankAccount> {
    const { uid } = request;
    this.logger.info(`uid: ${uid} starting bankaccount creation`, request);

    const profileInfos = await this._getProfileInformationGateway.getById(request.uid);
    this.logger.info(`uid: ${uid} fetched profile data to use for account creation`, profileInfos);

    const bankAccount = BankAccount.create({
      ...profileInfos,
      ...request,
    });

    this.logger.info(`uid: ${uid} creating account on our partner service`, bankAccount.props);
    const openedBankAccount = await this.bankAccountGateway.upsert({
      ...profileInfos,
      uid: bankAccount.id,
      informations: {
        ...profileInfos.informations,
        address: {
          zipCode: request.zipCode,
          street: request.street,
          additionalStreet: request.additionalStreet,
          country: request.country,
          city: request.city,
        },
      },
    });

    if (this._featureFlagKycOnCreation && profileInfos.kyc) {
      this.logger.info(`uid: ${uid} processing kyc`, bankAccount);
      await this._sendKycDocument(profileInfos);
      await this._sendKycFilters(profileInfos);
    }

    const { bankAccountId: bid, iban, bic } = openedBankAccount.props;

    bankAccount.open(bid, iban, bic);
    this.logger.info(`uid: ${uid} bankaccount opened using account from partner`, openedBankAccount.props);

    await this._bankAccountRepositoryWrite.save(bankAccount);
    this.logger.info(`uid: ${uid} bankaccount saved`);

    await this._eventDispatcher.dispatch(bankAccount);

    return bankAccount;
  }

  canExecute(identity: Identity): boolean {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.payment);
    return roles.permissions.write === Authorization.all;
  }

  private async _sendKycDocument(profileInfos: ProfileInfos): Promise<void> {
    const authorizedDecisionToSendDocument = [KycDecisionType.OK, KycDecisionType.OK_MANUAL];
    if (profileInfos.kyc.decision && authorizedDecisionToSendDocument.includes(profileInfos.kyc.decision)) {
      this.logger.info(`CREATE_BANK_ACCOUNT: Sending KYC Document for user: ${profileInfos.uid}`);
      const files = await this._storageGateway.getFiles(profileInfos.uid, profileInfos.kyc.documents);
      await this._kycGateway.createDocument(files);
    }
  }

  private async _sendKycFilters(profileInfos: ProfileInfos): Promise<void> {
    const authorizedDecisionToSendFilters = [
      KycDecisionType.OK,
      KycDecisionType.OK_MANUAL,
      KycDecisionType.KO_MANUAL,
    ];

    if (
      profileInfos.kyc.politicallyExposed &&
      profileInfos.kyc.sanctioned &&
      authorizedDecisionToSendFilters.includes(profileInfos.kyc.politicallyExposed) &&
      authorizedDecisionToSendFilters.includes(profileInfos.kyc.sanctioned)
    ) {
      this.logger.info(`CREATE_BANK_ACCOUNT: Sending KYC Filters for user: ${profileInfos.uid}`);
      await this._kycGateway.setFilters({
        uid: profileInfos.uid,
        kycValues: {
          decision: profileInfos.kyc.decision,
          politicallyExposed: profileInfos.kyc.politicallyExposed,
          sanctioned: profileInfos.kyc.sanctioned,
        },
      });
    }
  }
}
