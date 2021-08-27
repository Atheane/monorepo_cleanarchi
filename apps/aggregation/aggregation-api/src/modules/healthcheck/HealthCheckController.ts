import { Response } from 'express';
import { injectable } from 'inversify';
import { Get, JsonController, Res } from 'routing-controllers';
import * as httpStatus from 'http-status';

@JsonController('')
@injectable()
export class HealthCheckController {
  @Get('/status')
  async controlHealthCheck(@Res() res: Response): Promise<Response> {
    return res.sendStatus(httpStatus.OK);
  }
}
