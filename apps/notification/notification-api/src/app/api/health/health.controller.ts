import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Res } from 'routing-controllers';

@JsonController()
@injectable()
export class HealthCheckController {
  @Get('/status')
  async controlHealthCheck(@Res() res: Response): Promise<Response> {
    return res.sendStatus(httpStatus.OK);
  }
}
