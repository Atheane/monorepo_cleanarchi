import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Res } from 'routing-controllers';

@JsonController('')
@injectable()
export class HealthCheckController {
  @Get('/status')
  async controlHealthcheck(@Res() res: Response) {
    return res.sendStatus(httpStatus.OK);
  }
}
