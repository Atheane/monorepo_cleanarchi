import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { ApiProvider } from '@oney/common-core';
import { ServiceApi } from '@oney/common-adapters';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { EventProducerDispatcher } from '@oney/messages-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  BankAccount,
  BankAccountProperties,
  BankAccountGateway,
  UserGateway,
  UserRepository,
  BankRepository,
  BankConnectionRepository,
  RbacError,
  HydrateBankAccountService,
  AggregatedAccounts,
  BankAccountRepository,
} from '../../domain';

export interface AggregateAccountsCommand {
  connectionId: string;
  accounts: Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'>[];
  userId: string;
}

@injectable()
export class AggregateAccounts implements Usecase<AggregateAccountsCommand, BankAccount[]> {
  constructor(
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.bankRepository)
    private readonly bankRepository: BankRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.hydrateBankAccountService)
    private readonly hydrateBankAccountService: HydrateBankAccountService,
    @inject(EventProducerDispatcher)
    private readonly eventDispatcher: EventProducerDispatcher,
    @inject(AggregationIdentifier.serviceApiProvider)
    private readonly _serviceApiProvider: ApiProvider<ServiceApi>,
    @inject(EncodeIdentity) private readonly _encodeIdentity: EncodeIdentity,
  ) {}

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.aggregation);
    if (roles.permissions.write !== Authorization.self) {
      throw new RbacError.UserCannotWrite(
        `user ${identity.uid} not allowed to write on ${ServiceName.aggregation}`,
      );
    }
    return true;
  }

  async execute(request: AggregateAccountsCommand): Promise<BankAccount[]> {
    const { connectionId, accounts, userId } = request;
    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);
    new AggregatedAccounts(accounts).validate();
    const connection = await this.bankConnectionRepository.findBy({ connectionId });

    const bankAccounts = await this.bankAccountGateway.updateAccounts(connection.props.refId, accounts);

    const existingBankAccounts = await this.bankAccountRepository.filterBy({ userId });
    // if first aggregation
    if (existingBankAccounts.length === 0) {
      const ownerIdentity = await this.hydrateBankAccountService.getOwnerIdentity(connection.props.refId);
      const bank = await this.bankRepository.getById(connection.props.bankId);
      const holder = await this._encodeIdentity.execute({
        provider: IdentityProvider.odb,
        uid: 'aggregation',
        email: '',
        providerId: ServiceName.aggregation,
      });
      let isOwnerBankAccount = false;
      try {
        const {
          isOwnerBankAccount: isOwner,
        } = await this._serviceApiProvider.api().profile.verifyBankAccountOwner({
          uid: userId,
          holder,
          bankName: bank.name,
          ...ownerIdentity,
        });
        isOwnerBankAccount = isOwner;
      } catch (e) {
        defaultLogger.error('@oney/aggregation.AggregateAccounts.execute.catch', e);
      }
      await Promise.all(
        bankAccounts.map(async account => {
          await this.bankAccountRepository.save({ ...account.props, isOwnerBankAccount, ownerIdentity });
          account.aggregateBankAccount({ userId, isOwnerBankAccount });
          await this.eventDispatcher.dispatch(account);
        }),
      );
      return bankAccounts;
    }
    // if rename or disaggregation
    await Promise.all(bankAccounts.map(account => this.bankAccountRepository.save(account.props)));
    return bankAccounts;
  }
}
