import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { SyncAccountDebts } from '@oney/payment-core';
import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { JsonController, Param, Post, Res, UseBefore } from 'routing-controllers';
import { BankAccountMapper } from '../../../user/mappers/BankAccountMapper';
import { BankAccountDTO } from '../../../user/dto/BankAccountDTO';

@JsonController('/account/:accountId/debts')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class DebtsController {
  constructor(
    @inject(SyncAccountDebts) private readonly _syncAccountDebts: SyncAccountDebts,
    private readonly _bankAccountMapper: BankAccountMapper,
  ) {}

  @Post('/')
  async syncAccountDebts(@Param('accountId') accountId: string, @Res() res: Response) {
    const bankAccount = await this._syncAccountDebts.execute(accountId);
    const bankAccountDto: BankAccountDTO = this._bankAccountMapper.fromDomain(bankAccount);
    return res.status(200).send(bankAccountDto);
  }
}
