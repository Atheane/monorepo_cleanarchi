import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { IAppConfiguration, SplitContractRepository, TermsService } from '../../domain';

export interface GetTermsCommands {
  versionNumber?: string;
  contractNumber?: string;
}

@injectable()
export class GetTerms implements Usecase<GetTermsCommands, Buffer> {
  constructor(
    @inject(CreditIdentifiers.configuration) private readonly configuration: IAppConfiguration,
    @inject(CreditIdentifiers.termsService) private readonly termsService: TermsService,
    @inject(CreditIdentifiers.splitContractRepository)
    private readonly splitContractRepository: SplitContractRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: GetTermsCommands): Promise<Buffer> {
    let versionNumber: string;
    if (request.contractNumber) {
      const contract = await this.splitContractRepository.getByContractNumber(request.contractNumber);
      versionNumber = contract.termsVersion;
    }
    return this.termsService.getTerms(
      `${versionNumber || request.versionNumber || this.configuration.odbCreditTermsVersion}.pdf`,
    );
  }

  async canExecute(identity: Identity): Promise<boolean> {
    const scope =
      identity && identity.roles && identity.roles.find(item => item.scope.name === ServiceName.credit);
    if (!scope) {
      return false;
    }

    const isOwner = scope.permissions.read === Authorization.self;
    if (isOwner) {
      return true;
    }
    const isAuthorizedAzureIdentity =
      scope.permissions.read === Authorization.all && identity.provider === IdentityProvider.azure;
    return isAuthorizedAzureIdentity;
  }
}
