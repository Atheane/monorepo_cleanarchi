import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { MakeTransfer } from '@oney/payment-core';
import { Response } from 'express';
import { injectable } from 'inversify';
import { Body, JsonController, Param, Post, Res, UseBefore } from 'routing-controllers';
import { UserMiddleware } from '../../../server/config/middlewares/UserMiddleware';
import { TransferCommand } from '../commands/TransferCommand';
import { TransferMapper } from '../mapper/TransferMapper';

@JsonController('/transfer')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class TransferController {
  constructor(private readonly makeTransfer: MakeTransfer, private readonly transferMapper: TransferMapper) {}

  @UseBefore(UserMiddleware)
  @Post('/:uid')
  async processTransfer(@Body() cmd: TransferCommand, @Param('uid') userId: string, @Res() res: Response) {
    const body = TransferCommand.setProperties(cmd);
    const recurency =
      body.frequencyType != null && body.recurrentEndDate != null
        ? {
            endRecurrency: body.recurrentEndDate,
            frequencyType: body.frequencyType,
          }
        : null;
    const transfer = await this.makeTransfer.execute({
      reason: body.motif,
      message: body.message,
      amount: body.amount,
      userId,
      beneficiaryId: body.bankAccountId,
      executionDate: body.executionDate,
      recurrency: recurency,
      recipientEmail: body.recipientEmail,
    });

    const transferDto = this.transferMapper.fromDomain(transfer);

    return res.status(201).send(transferDto);
  }
}
