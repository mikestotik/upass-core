import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { SettingsEntity } from '../../entities/settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ SettingsEntity ]),
    ConfigModule
  ],
  controllers: [
    SettingsController
  ],
  providers: [
    SettingsService
  ],
  exports: [
    TypeOrmModule,
    SettingsService
  ]
})
export class SettingsModule {}
