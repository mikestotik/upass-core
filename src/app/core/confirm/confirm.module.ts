import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { UserModule } from '../user/user.module';
import { ConfirmController } from './confirm.controller';
import { ConfirmEntity } from '../../entities/confirm.entity';
import { ConfirmService } from './confirm.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ ConfirmEntity ]),
    ConfigModule,
    UserModule
  ],
  controllers: [
    ConfirmController
  ],
  providers: [
    ConfirmService
  ],
  exports: [
    ConfirmService
  ]
})
export class ConfirmModule {}
