import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { LoginEntity } from '../../entities/login.entity';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ LoginEntity ]),
    ConfigModule,
  ],
  controllers: [
    LoginController,
  ],
  providers: [
    LoginService,
  ],
  exports: [
    TypeOrmModule,
    ConfigModule,
  ],
})
export class LoginModule {}
