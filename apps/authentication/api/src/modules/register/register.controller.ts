import {
  SignUpUser,
  RegisterCreate,
  RegisterCreateError,
  RegisterValidate,
  RegisterValidateError,
  DefaultDomainErrorMessages,
} from '@oney/authentication-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Body, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';
import { UserMapper } from '@oney/authentication-adapters';
import { CreateCommand } from './commands/create.command';
import { InvitationMiddleware } from './middlewares/InvitationMiddleware';
import { InvitationTokenPayload } from '../configuration/reqContext/Invitation';

@JsonController('/register')
@injectable()
export class RegisterController {
  constructor(
    private readonly _registerCreate: RegisterCreate,
    private readonly _registerValidate: RegisterValidate,
    private readonly _signUpUser: SignUpUser,
    private readonly _encodeIdentity: EncodeIdentity,
    private readonly _mapper: UserMapper,
  ) {}

  @Post('/create')
  async create(@Res() res: Response, @Body() create: CreateCommand) {
    try {
      const command = { email: create.email, phone: create.phone };
      const result = await this._registerCreate.execute(command);
      return res.status(httpStatus.CREATED).send(result);
    } catch (e) {
      if (e instanceof RegisterCreateError.UserAlreadyExist) {
        return res.status(httpStatus.CONFLICT).send({
          error: e.message,
        });
      }
      return res.status(httpStatus.UNAUTHORIZED).send(e);
    }
  }

  @UseBefore(InvitationMiddleware)
  @Post('/validate')
  async validate(@Req() req: InvitationTokenPayload, @Res() res: Response) {
    try {
      const invitation = await this._registerValidate.execute({ invitationId: req.invitation.uid });
      // safeguard before creating / signing up user
      if (!invitation.isCompleted()) {
        throw new RegisterValidateError.InvitationNotCompleted(
          DefaultDomainErrorMessages.INVITATION_NOT_COMPLETED,
        );
      }
      const user = await this._signUpUser.execute({
        associateProfile: true,
        email: invitation.email,
        phone: invitation.phone,
      });
      const { uid, email } = user.props;
      const command = { uid, email: email.address, provider: IdentityProvider.odb };
      const encodeUserToken = await this._encodeIdentity.execute(command);
      res.setHeader('user_token', encodeUserToken);
      const userDto = this._mapper.fromDomain(user);
      return res.status(httpStatus.OK).send(userDto);
    } catch (e) {
      if (e.cause?.status) return this._respondWithUserCreationError(e, res);
      return this._respondWithUnauthorizedError(res, e);
    }
  }

  private _respondWithUserCreationError(e: any, res: Response) {
    const statusCode = e.cause.status;
    return res.status(statusCode).send({
      code: statusCode,
      type: 'ODB_ACCOUNT_USER_CREATION_FAILED',
      message: `User creation failed on odb-account with code ${statusCode}`,
      odbAccountError: e.cause.apiErrorReason,
    });
  }

  private _respondWithUnauthorizedError(res: Response, e: any) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      code: httpStatus.UNAUTHORIZED,
      name: e.name,
      message: e.message,
    });
  }
}
