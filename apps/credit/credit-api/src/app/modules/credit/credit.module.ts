import { Module } from '@nestjs/common';
import { CreditController } from './credit.controller';
import { JwtStrategy } from '../guards';

@Module({
  imports: [],
  controllers: [CreditController],
  providers: [JwtStrategy],
})
export class CreditModule {}
