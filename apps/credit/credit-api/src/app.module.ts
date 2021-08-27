import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule, TermsModule, CreditModule } from './app';
import { AppController } from './app.controller';
import { getAppConfiguration } from './config/app/AppConfigurationService';
import { AuthenticationMiddleware } from './config/middlewares';

@Module({
  imports: [
    TermsModule,
    UserModule,
    CreditModule,
    AppController,
    PassportModule,
    JwtModule.register({
      secret: getAppConfiguration().jwtSignatureKey,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({ path: '/details', method: RequestMethod.ALL });
    consumer.apply(AuthenticationMiddleware).forRoutes({ path: '/users', method: RequestMethod.ALL });
    consumer.apply(AuthenticationMiddleware).forRoutes({ path: '/terms', method: RequestMethod.ALL });
  }
}
