import { Module } from '@nestjs/common';
import { TermsController } from './terms.controller';
import { JwtStrategy } from '../guards';

@Module({
  imports: [],
  controllers: [TermsController],
  providers: [JwtStrategy],
})
export class TermsModule {}
