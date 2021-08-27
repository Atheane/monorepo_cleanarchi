import { CleanPinCode, GetUser, SetPinCode, UserError } from '@oney/authentication-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Body, Delete, Get, JsonController, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import { UserMapper } from '@oney/authentication-adapters';
import { SetPinCodeCommand } from './commands/SetPinCodeCommand';
import { ClearPinCodeMiddleware } from './middlewares/ClearPinCodeMiddleware';
import { ScaAuthorizationTokenMiddleware } from '../../config/middlewares/ScaAuthorizationTokenMiddleware';
import { UserAuthorizationTokenMiddleware } from '../../config/middlewares/UserAuthorizationTokenMiddleware';
import { UserRequest } from '../configuration/reqContext/User';

@JsonController('/user')
@injectable()
export class UserController {
  constructor(
    private readonly _setPinCode: SetPinCode,
    private readonly _getUser: GetUser,
    private readonly _cleanPinCode: CleanPinCode,
    private readonly _mapper: UserMapper,
  ) {}

  @UseBefore(UserAuthorizationTokenMiddleware)
  @Post('/pincode')
  async setUserPinCode(@Req() req: UserRequest, @Res() res: Response, @Body() cmd: SetPinCodeCommand) {
    try {
      const user = await this._setPinCode.execute({ userId: req.user.uid, pinCode: cmd });
      return res.status(httpStatus.CREATED).send(this._mapper.fromDomain(user));
    } catch (e) {
      if (e instanceof UserError.NonValidDigitPinCode) return res.status(httpStatus.FORBIDDEN).send(e);
      return res.status(httpStatus.BAD_REQUEST).send(e);
    }
  }

  @UseBefore(ScaAuthorizationTokenMiddleware)
  @UseBefore(ClearPinCodeMiddleware)
  @Delete('/:uid/pincode')
  async resetPinCode(@Req() req: UserRequest, @Param('uid') uid: string, @Res() res: Response) {
    const result = await this._cleanPinCode.execute({ userId: uid });
    return res.status(httpStatus.OK).send(this._mapper.fromDomain(result));
  }

  @UseBefore(UserAuthorizationTokenMiddleware)
  @Get('/')
  async getUserById(@Req() req: UserRequest, @Res() res: Response) {
    const user = await this._getUser.execute({ userId: req.user.uid });
    return res.status(httpStatus.OK).send(this._mapper.fromDomain(user));
  }
}
