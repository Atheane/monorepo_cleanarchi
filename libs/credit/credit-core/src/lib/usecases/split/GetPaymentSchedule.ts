import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { PaymentScheduleService } from '../../domain';

export interface GetPaymentScheduleCommands {
  uid: string;
  file: string;
}

@injectable()
export class GetPaymentSchedule implements Usecase<GetPaymentScheduleCommands, Buffer> {
  constructor(
    @inject(CreditIdentifiers.paymentScheduleService)
    private readonly paymentScheduleService: PaymentScheduleService,
  ) {}

  execute(request: GetPaymentScheduleCommands): Promise<Buffer> {
    return this.paymentScheduleService.getPaymentScheduleService(request.file);
  }

  async canExecute(identity: Identity, request: GetPaymentScheduleCommands): Promise<boolean> {
    const scope =
      identity && identity.roles && identity.roles.find(item => item.scope.name === ServiceName.credit);
    if (!scope) {
      return false;
    }

    const isOwner = identity.uid === request.uid && scope.permissions.read === Authorization.self;
    if (isOwner) {
      return true;
    }
    const isAuthorizedAzureIdentity =
      scope.permissions.read === Authorization.all && identity.provider === IdentityProvider.azure;
    return isAuthorizedAzureIdentity;
  }
}
