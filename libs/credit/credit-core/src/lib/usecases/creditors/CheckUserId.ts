import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { GuardGateway } from '../../domain/gateways';

export interface CheckUserIdCommands {
  userId: string;
  userToken: string;
}

@injectable()
export class CheckUserId implements Usecase<CheckUserIdCommands, boolean> {
  constructor(@inject(CreditIdentifiers.guardGateway) private readonly guardGateway: GuardGateway) {}

  execute(request: CheckUserIdCommands): boolean {
    const { userId, userToken } = request;
    return this.guardGateway.checkUserId(userId, userToken);
  }
}
