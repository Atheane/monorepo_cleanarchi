import { SynchronizeConnection } from '@oney/aggregation-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Post, JsonController, Res, Body, UseBefore } from 'routing-controllers';
import { ConnectionSyncCommand } from './commands';
import { BudgetInsightGuard } from './middlewares/BudgetInsightGuard';
import { BankConnectionMapper } from '../user/mappers/BankConnectionMapper';

@JsonController('/connections')
@UseBefore(BudgetInsightGuard)
@injectable()
export class BankConnectionController {
  constructor(
    private readonly _synchronizeConnection: SynchronizeConnection,
    private readonly bankConnectionMapper: BankConnectionMapper,
  ) {}

  @Post('/connection_sync')
  async syncBankConnection(@Body() cmd: ConnectionSyncCommand, @Res() res: Response): Promise<Response> {
    const {
      connection: { id, state, active },
    } = ConnectionSyncCommand.setProperties(cmd);
    console.log(`Connection ${id} sync to state ${state}`);
    const updatedConnection = await this._synchronizeConnection.execute({
      refId: id.toString(),
      state,
      active,
    });
    const connectionDto = this.bankConnectionMapper.fromDomain(updatedConnection);
    return res.status(httpStatus.OK).send(connectionDto);
  }
}
