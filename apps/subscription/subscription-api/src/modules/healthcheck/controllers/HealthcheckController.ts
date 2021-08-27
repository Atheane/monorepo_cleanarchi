import { Response } from 'express';
import { injectable } from 'inversify';
import { Get, JsonController, Res } from 'routing-controllers';

@JsonController('/status')
@injectable()
export class HealthcheckController {
  @Get('/')
  healthCheckRoute(@Res() res: Response) {
    return res.sendStatus(200);
  }
}
