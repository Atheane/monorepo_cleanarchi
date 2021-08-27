import { GetTerms } from '@oney/aggregation-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { JsonController, Res, QueryParams, Get } from 'routing-controllers';
import { GetTermsCommand } from './commands';

@JsonController('/terms')
@injectable()
export class TermsController {
  constructor(private readonly _getTerms: GetTerms) {}

  @Get('/')
  async getAllBanks(@Res() res: Response, @QueryParams() query: GetTermsCommand): Promise<Response> {
    const { versionNumber } = GetTermsCommand.setProperties(query);
    const document = await this._getTerms.execute({
      versionNumber,
    });

    res.set('Content-Type', 'application/json');
    return res.status(httpStatus.OK).send(document);
  }
}
