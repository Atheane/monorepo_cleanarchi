import { Controller, Query, HttpStatus, Get, Res, Req, UseInterceptors } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthentifiedRequest } from '@oney/credit-core';
import { GetPaymentScheduleQuery } from './queries/CreditGetAllSplitContractQuery';
import { getKernelDependencies } from '../../../config/Setup';
import { SplitCreditDetailsType } from '../../../docs';
import { ErrorHandlerInterceptor } from '../../../config/interceptors/ErrorHandlerInterceptor';

@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer user_token',
})
@Controller('')
@UseInterceptors(ErrorHandlerInterceptor)
export class CreditController {
  @ApiOperation({ summary: 'Get contract to all users' })
  @ApiOkResponse({ type: SplitCreditDetailsType, isArray: true })
  @Get('/details')
  async getUserContracts(
    @Req() req: AuthentifiedRequest,
    @Query() query: GetPaymentScheduleQuery,
    @Res() res: Response,
  ) {
    const canExecute = await getKernelDependencies().creditGetAllSplitContract.canExecute(req.user);
    if (!canExecute) {
      return res.sendStatus(401);
    }
    const result = await getKernelDependencies().creditGetAllSplitContract.execute({
      status: query.status,
    });
    return res.status(HttpStatus.OK).send(result);
  }
}
