import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { CanExecuteResultEnum } from '@oney/identity-core';
import { AuthentifiedRequest } from '@oney/credit-core';
import {
  CreateSplitContractCommand,
  SimulatesSplitCommand,
  ValidateSplitSimulationCommand,
} from './commands';
import { GetPaymentScheduleQuery } from './queries/GetPaymentScheduleQuery';
import { getKernelDependencies } from '../../../config/Setup';
import {
  ContractType,
  SimulationType,
  SplitCreditDetailsType,
  CreditorPropertiesType,
  CreditorErrorUserNotFoundType,
} from '../../../docs';
import { ScaExceptionFilter } from '../../../config/middlewares/ScaExceptionFilter';
import { ErrorHandlerInterceptor } from '../../../config/interceptors/ErrorHandlerInterceptor';

@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer user_token',
})
@Controller('users/:userId')
@UseInterceptors(ErrorHandlerInterceptor)
export class UserController {
  @ApiOperation({ summary: 'Get a loan simulation' })
  @ApiOkResponse({ type: SimulationType })
  @Post('/simulations')
  async simulations(
    @Req() req: AuthentifiedRequest,
    @Param('userId') userId: string,
    @Body() body: SimulatesSplitCommand,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await getKernelDependencies().simulateSplit.execute({
      userId,
      ...body,
    });
    return res.status(HttpStatus.OK).send(result);
  }

  @ApiOperation({
    summary: 'Create SplitProduct and send validation split product event to CDP',
  })
  @ApiOkResponse({ type: SimulationType })
  @Post('/validation')
  async createSplitProduct(
    @Body() body: ValidateSplitSimulationCommand,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await getKernelDependencies().validateSplitSimulation.execute({ ...body });
    return res.status(HttpStatus.OK).send(result);
  }

  @ApiOperation({
    summary: 'Send validation split product event to CDP and create SplitProduct',
  })
  @ApiOkResponse({ type: ContractType })
  @Post('/subscription')
  @UseFilters(ScaExceptionFilter)
  async confirmSplitProduct(
    @Body() body: CreateSplitContractCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const isAuthorized = await getKernelDependencies().createSplitContract.canExecute(req.user, body);
    if (isAuthorized.result === CanExecuteResultEnum.SCA_NEEDED) {
      await getKernelDependencies().verifySca.execute({
        action: {
          payload: isAuthorized.scaPayload.payload,
          type: isAuthorized.scaPayload.actionType,
        },
        identity: req.user,
      });
    }
    const result = await getKernelDependencies().createSplitContract.execute({
      ...body,
    });
    return res.status(HttpStatus.OK).send(result);
  }

  @ApiOperation({ summary: 'Get contract' })
  @ApiOkResponse({ type: SplitCreditDetailsType })
  @Get('/details/:initialTransactionId')
  async getSplitProduct(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param() params: { initialTransactionId: string; userId: string },
  ): Promise<Response> {
    const payload = {
      uid: params.userId,
      initialTransactionId: params.initialTransactionId,
    };
    const canExecute = await getKernelDependencies().getOneSplitContract.canExecute(req.user, payload);
    if (!canExecute) {
      return res.sendStatus(401);
    }
    const result = await getKernelDependencies().getOneSplitContract.execute(payload);
    return res.status(HttpStatus.OK).send(result);
  }

  @ApiOperation({ summary: 'Get user contracts' })
  @ApiOkResponse({ type: SplitCreditDetailsType, isArray: true })
  @Get('/details')
  async getUserContracts(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('userId') userId: string,
  ): Promise<Response> {
    const payload = {
      uid: userId,
    };
    const canExecute = await getKernelDependencies().getSplitContracts.canExecute(req.user, payload);
    if (!canExecute) {
      return res.sendStatus(401);
    }
    const result = await getKernelDependencies().getSplitContracts.execute(payload);
    return res.status(HttpStatus.OK).send(result);
  }

  @ApiOperation({ summary: 'Get user payment schedule pdf file' })
  @Get('/paymentSchedule')
  async getPaymentSchedule(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Query() query: GetPaymentScheduleQuery,
    @Param('userId') userId: string,
  ): Promise<Response> {
    const payload = {
      uid: userId,
      file: `${userId}/payment schedule/${query.bankAccountId}/${query.contractNumber}.pdf`,
    };
    const canExecute = await getKernelDependencies().getPaymentSchedule.canExecute(req.user, payload);
    if (!canExecute) {
      return res.sendStatus(401);
    }
    const file = await getKernelDependencies().getPaymentSchedule.execute(payload);

    res.set('Content-Type', 'application/pdf');
    res.send(file);
  }

  @ApiOperation({ summary: 'Get creditor eligibility' })
  @ApiOkResponse({ type: CreditorPropertiesType })
  @ApiNotFoundResponse({ type: CreditorErrorUserNotFoundType })
  @Get('/eligibility')
  async getCreditor(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('userId') userId: string,
  ): Promise<Response> {
    const payload = {
      uid: userId,
    };
    const canExecute = await getKernelDependencies().getCreditor.canExecute(req.user);
    if (!canExecute) {
      return res.sendStatus(401);
    }
    const result = await getKernelDependencies().getCreditor.execute(payload);
    return res.status(HttpStatus.OK).send({
      isEligible: result.props.isEligible,
    });
  }
}
