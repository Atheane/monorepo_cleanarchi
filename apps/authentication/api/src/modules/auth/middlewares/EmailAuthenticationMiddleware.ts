import { AuthIdentifier, SensitiveAction, UserRepository } from '@oney/authentication-core';
import { MaybeType } from '@oney/common-core';
import { IdentityProvider } from '@oney/identity-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { inject, injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { UserRequest } from '../../configuration/reqContext/User';

@injectable()
export class EmailAuthenticationMiddleware implements ExpressMiddlewareInterface {
  constructor(@inject(AuthIdentifier.userRepository) private readonly _userRepository: UserRepository) {}

  async use(req: UserRequest, res: Response, next: Function) {
    const { email } = req.body;
    const maybeFoundUser = await this._userRepository.findByEmail(email);
    if (maybeFoundUser.type === MaybeType.Nothing) return res.sendStatus(httpStatus.NOT_FOUND);
    const foundUser = maybeFoundUser.value;
    const { uid: foundUid, email: foundEmail } = foundUser.props;

    // We ensure here for signin specific that the action is SignIn.
    req.body.action = {
      type: 'SIGN_IN',
      payload: Buffer.from(
        JSON.stringify({
          request: {
            // @TODO: Handle more generic body and other data types than req.body (ie req.file as an example)
            body: req.body,
            headers: req.headers,
          },
          url: new URL(`${req.protocol}://${req.hostname}${req.url}`),
        } as SensitiveAction),
        'utf8',
      ).toString('base64'),
    };

    req.user = {
      uid: foundUid,
      email: foundEmail.address,
      provider: IdentityProvider.odb,
      roles: [],
      name: IdentityProvider.odb,
    };
    return next();
  }
}
