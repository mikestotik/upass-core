import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';


@Module({
  imports: [
    AuthModule,
    ConfigModule
  ],
  controllers: [
    GoogleController
  ],
  providers: [
    GoogleStrategy
  ]
})
export class GoogleModule {}
