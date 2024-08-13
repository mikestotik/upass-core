import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { OtpModule } from '../otp/otp.module';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './services/token.service';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';


@Module({
  imports: [
    HttpModule,
    UserModule,
    OtpModule,
    ConfigModule,
    MailerModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
