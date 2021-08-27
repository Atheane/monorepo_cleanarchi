import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Param, Req, Res, UseBefore } from 'routing-controllers';
import { GetContract, GetContractCommand } from '@oney/profile-core';
import { AuthentifiedRequest } from '../../config/middlewares/types/AuthentifiedRequest';

@JsonController('/:uid/contract')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class ContractController {
  constructor(private readonly _getContract: GetContract) {}

  @Get()
  async getContract(@Param('uid') uid: string, @Res() res: Response, @Req() req: AuthentifiedRequest) {
    const contractCommand: GetContractCommand = {
      uid,
    };

    const isAuthorized = await this._getContract.canExecute(req.user, contractCommand);
    if (!isAuthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const contractDocument = await this._getContract.execute(contractCommand);

    return res.header('Content-Type', 'application/pdf').status(httpStatus.OK).send(contractDocument);
  }
}
