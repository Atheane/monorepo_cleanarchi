import { Response } from 'express';
import { injectable } from 'inversify';
import { Get, JsonController, Res } from 'routing-controllers';
import * as httpStatus from 'http-status';

@JsonController('/status')
@injectable()
export class HealthcheckController {
  @Get('/')
  healthCheckRoute(@Res() res: Response) {
    return res.sendStatus(httpStatus.OK);
  }
}
