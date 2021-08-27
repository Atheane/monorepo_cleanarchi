import { Controller, Get, Req, Res } from '@nestjs/common';
import * as httpStatus from 'http-status';

@Controller()
export class AppController {
  @Get('/status')
  async healthCheck(@Req() req, @Res() res) {
    return res.sendStatus(httpStatus.OK);
  }
}
