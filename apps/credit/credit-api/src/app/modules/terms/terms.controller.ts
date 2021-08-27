import { Controller, Get, HttpStatus, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthentifiedRequest } from '@oney/credit-core';
import { GetTermsQuery } from './queries';
import { getKernelDependencies } from '../../../config/Setup';
import { ErrorHandlerInterceptor } from '../../../config/interceptors/ErrorHandlerInterceptor';

@ApiTags('terms')
@Controller('terms')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer user_token',
})
@UseInterceptors(ErrorHandlerInterceptor)
export class TermsController {
  @ApiOperation({ summary: 'Get terms pdf file' })
  @Get('/')
  async getTerms(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Query() query: GetTermsQuery,
  ): Promise<Response> {
    const canExecute = await getKernelDependencies().getTerms.canExecute(req.user);
    if (!canExecute) {
      return res.sendStatus(401);
    }

    if (query.contractNumber && query.versionNumber) {
      return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    const file = await getKernelDependencies().getTerms.execute({
      ...query,
    });

    res.set('Content-Type', 'application/pdf');
    return res.send(file);
  }
}
