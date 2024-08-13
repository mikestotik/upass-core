import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { UserModule } from '../user/user.module';
import { OtpController } from './otp.controller';
import { OtpEntity } from '../../entities/otp.entity';
import { OtpService } from './otp.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ OtpEntity ]),
    ConfigModule,
    UserModule
  ],
  controllers: [
    OtpController
  ],
  providers: [
    OtpService
  ],
  exports: [
    OtpService
  ]
})
export class OtpModule {}
