import { SignUpUser, GetUser, OneyTokenKeys } from '@oney/authentication-core';
import { EncodeIdentity } from '@oney/identity-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Body, Get, JsonController, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import { v4 as uuidv4 } from 'uuid';
import { UserMapper } from '@oney/authentication-adapters';
import { CreateUserCommand } from './commands/CreateUserCommand';
import { UsingBasicAuthUriPath } from '../provisionning/UsingBasicAuthUriPath';
import { UserAuthorizationTokenMiddleware } from '../../config/middlewares/UserAuthorizationTokenMiddleware';
import { UserRequest } from '../configuration/reqContext/User';
import { BasicAuthMiddleware } from '../provisionning/middlewares/BasicAuthMiddleware';

@JsonController('/partner')
@injectable()
export class PartnerController {
  constructor(
    private readonly _signUpUser: SignUpUser,
    private readonly _getUser: GetUser,
    private readonly _encodeIdentity: EncodeIdentity,
    private readonly _oneyTokenKeys: OneyTokenKeys,
    private readonly _mapper: UserMapper,
  ) {}

  @Post('/user')
  @UseBefore(UserAuthorizationTokenMiddleware)
  async createUser(@Body() cmd: CreateUserCommand, @Res() res: Response, @Req() req: UserRequest) {
    const isAuthorized = await this._signUpUser.canExecute(req.user);
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const generatedEmail = `${uuidv4()}_${req.user.name}_@lead.oney.com`;
    const signUpcommand = {
      associateProfile: false,
      email: generatedEmail,
      metadata: { provider: req.user.name, email: cmd.email },
    };
    const user = await this._signUpUser.execute(signUpcommand);
    const { uid, email } = user.props;
    const encodeIdentiyCommand = {
      uid,
      email: email.address,
      providerId: req.user.uid,
      provider: req.user.provider,
    };
    const encodeUserToken = await this._encodeIdentity.execute(encodeIdentiyCommand);
    res.setHeader('user_token', encodeUserToken);
    return res.status(httpStatus.OK).send(this._mapper.fromDomain(user));
  }

  @Get('/token/:uid')
  @UseBefore(UserAuthorizationTokenMiddleware)
  async getUserToken(@Param('uid') userId: string, @Res() res: Response, @Req() req: UserRequest) {
    const isAuthorized = await this._getUser.canExecute(req.user);
    if (!isAuthorized) return res.sendStatus(401);
    const user = await this._getUser.execute({ userId: userId });
    const { uid, email, metadata } = user.props;
    /* istanbul ignore if : Testable with another azureAd token and roles and so on ... */
    if (!metadata || metadata.provider !== req.user.name) return res.sendStatus(httpStatus.FORBIDDEN);
    const command = { uid, email: email.address, provider: req.user.provider, providerId: req.user.uid };
    const encodeUserToken = await this._encodeIdentity.execute(command);
    res.setHeader('user_token', encodeUserToken);
    return res.status(httpStatus.OK).send(this._mapper.fromDomain(user));
  }

  @Get(UsingBasicAuthUriPath.ONEY_TOKEN_KEYS)
  @UseBefore(BasicAuthMiddleware)
  async getOneyfrTokenKeys(@Res() res: Response) {
    const keys = await this._oneyTokenKeys.execute();
    return res.status(httpStatus.OK).send({ keys });
  }
}
