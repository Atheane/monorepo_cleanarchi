import {
  AuthFactor,
  AuthIdentifier,
  DefaultDomainErrorMessages,
  DefaultUiErrorMessages,
  SensitiveAction,
  UserError,
  UserRepository,
} from '@oney/authentication-core';
import { MaybeType } from '@oney/common-core';
import { IdentityProvider } from '@oney/identity-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { inject, injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { UserRequest } from '../../configuration/reqContext/User';

@injectable()
export class ClearPinCodeMiddleware implements ExpressMiddlewareInterface {
  constructor(@inject(AuthIdentifier.userRepository) private readonly _userRepository: UserRepository) {}

  async use(req: UserRequest, res: Response, next: Function) {
    const userId = req.params.uid;
    const maybeUser = await this._userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: 404,
        type: DefaultDomainErrorMessages.USER_NOT_FOUND,
        message: DefaultUiErrorMessages.USER_NOT_FOUND,
      });
    }
    const user = maybeUser.value;
    const { uid, email } = user.props;
    const authenticationMode = user.getUserAuthenticationMode();
    if (authenticationMode.authFactor !== AuthFactor.PIN_CODE) {
      return res.status(httpStatus.FORBIDDEN).send(new UserError.PinCodeNotSet('PIN_CODE_NOT_SETTED'));
    }

    req.body.action = {
      type: 'CLEAR_PIN_CODE',
      payload: Buffer.from(
        JSON.stringify({
          request: {
            body: null,
            headers: req.headers,
          },
          url: new URL(`${req.protocol}://${req.hostname}${req.url}`),
        } as SensitiveAction),
        'utf8',
      ).toString('base64'),
    };
    req.user = {
      uid,
      email: email.address,
      roles: [],
      provider: IdentityProvider.odb,
      name: IdentityProvider.odb,
    };
    return next();
  }
}
