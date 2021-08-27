import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { JwtStrategy } from '../guards';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [JwtStrategy],
})
export class UserModule {}
