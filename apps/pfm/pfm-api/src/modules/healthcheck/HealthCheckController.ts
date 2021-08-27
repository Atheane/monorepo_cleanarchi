import { Get, JsonController, Res } from 'routing-controllers';
import { Response } from 'express';
import { injectable } from 'inversify';
import * as httpStatus from 'http-status';

@JsonController('')
@injectable()
export class HealthCheckController {
  @Get('/status')
  async controlHealthcheck(@Res() res: Response) {
    return res.sendStatus(httpStatus.OK);
  }
}
