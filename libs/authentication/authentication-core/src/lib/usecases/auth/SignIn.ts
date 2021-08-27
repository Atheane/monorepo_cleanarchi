import { UserSignedIn } from '@oney/authentication-messages';
import { Usecase } from '@oney/ddd';
import { EventDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { User } from '../../domain/aggregates/User';
import { AuthenticationGateway } from '../../domain/gateways/auth/AuthenticationGateway';
import { PinCode } from '../../domain/valueobjects/PinCode';
import { AuthIdentifier } from '../AuthIdentifier';
import { AuthenticationError } from '../..';

export interface SignInCommand {
  email: string;
}

@injectable()
export class SignIn implements Usecase<SignInCommand, User> {
  constructor(
    @inject(AuthIdentifier.authenticationGateway)
    private readonly authenticationGateway: AuthenticationGateway,
    @inject(EventDispatcher) private readonly _eventDispatcher: EventDispatcher,
  ) {}

  async execute(request: SignInCommand): Promise<User> {
    const user = await this.authenticationGateway.signIn(request.email);
    if (user.isBanned()) {
      throw new AuthenticationError.AccountBlocked('AUTHENTICATION_FAILED');
    }
    const { uid, email, phone, pinCode } = user.props;
    const userSignedIn = new UserSignedIn({ uid, email: email.address });
    await this._eventDispatcher.dispatch(userSignedIn);
    return new User({ uid, phone, email, pinCode: PinCode.get(pinCode) });
  }
}
