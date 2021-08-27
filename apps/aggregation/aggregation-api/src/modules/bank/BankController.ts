import { GetAllBanks, GetBankById } from '@oney/aggregation-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Res, Param } from 'routing-controllers';
import { BankMapper } from './mappers';

@JsonController('/banks')
@injectable()
export class BankController {
  constructor(
    private readonly _getAllBanks: GetAllBanks,
    private readonly _getBankById: GetBankById,
    private readonly bankMapper: BankMapper,
  ) {}

  @Get('')
  async getAllBanks(@Res() res: Response): Promise<Response> {
    const banks = await this._getAllBanks.execute();
    const result = banks.map(bank => this.bankMapper.fromDomainWithForm(bank));
    return res.status(httpStatus.OK).send(result);
  }

  @Get('/:bankId')
  async getBankById(@Param('bankId') bankId: string, @Res() res: Response): Promise<Response> {
    const bank = await this._getBankById.execute({
      id: bankId,
    });
    const result = this.bankMapper.fromDomainWithForm(bank);
    return res.status(httpStatus.OK).send(result);
  }
}
