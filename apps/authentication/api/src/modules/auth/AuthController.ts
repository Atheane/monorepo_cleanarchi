import { SignIn } from '@oney/authentication-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { Response } from 'express';
import { injectable } from 'inversify';
import { Body, JsonController, Post, Res, UseBefore } from 'routing-controllers';
import { UserMapper } from '@oney/authentication-adapters';
import { SignInCommand } from './commands/SignInCommand';
import { EmailAuthenticationMiddleware } from './middlewares/EmailAuthenticationMiddleware';
import { ScaAuthorizationTokenMiddleware } from '../../config/middlewares/ScaAuthorizationTokenMiddleware';

@JsonController('/auth')
@UseBefore(EmailAuthenticationMiddleware)
@injectable()
export class AuthController {
  constructor(
    private readonly _signIn: SignIn,
    private readonly _encodeIdentity: EncodeIdentity,
    private readonly _mapper: UserMapper,
  ) {}

  @UseBefore(ScaAuthorizationTokenMiddleware)
  @Post('/signin')
  async signIn(@Res() res: Response, @Body() cmd: SignInCommand) {
    const user = await this._signIn.execute(cmd);
    const { uid, email } = user.props;
    const command = { uid, email: email.address, provider: IdentityProvider.odb };
    const encodeUserToken = await this._encodeIdentity.execute(command);
    res.setHeader('user_token', encodeUserToken);
    return res.status(200).send(this._mapper.fromDomain(user));
  }
}
