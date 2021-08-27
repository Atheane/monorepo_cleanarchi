import { CreateP2P } from '@oney/payment-core';
import { Response } from 'express';
import { injectable } from 'inversify';
import { Body, JsonController, Post, Res, UseBefore } from 'routing-controllers';
import { ProcessPaymentCommand } from '../commands/ProcessPaymentCommand';
import { BasicAuthMiddleware } from '../middlewares/BasicAuthMiddleware';
import { TransferDto } from '../../transfer/dto/TransferDto';
import { TransferMapper } from '../../transfer/mapper/TransferMapper';

@UseBefore(BasicAuthMiddleware)
@JsonController('/p2p')
@injectable()
export class PaymentController {
  constructor(private readonly processPayment: CreateP2P, private readonly transferMapper: TransferMapper) {}

  @Post('/')
  async processPaymentRoute(@Body() cmd: ProcessPaymentCommand, @Res() res: Response) {
    const body = ProcessPaymentCommand.setProperties(cmd);
    const transfer = await this.processPayment.execute(body);
    const transferDto: TransferDto = this.transferMapper.fromDomain(transfer);
    return res.status(201).send(transferDto);
  }
}
