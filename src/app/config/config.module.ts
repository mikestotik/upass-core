import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import configLoader from "../../config";
import { ConfigService } from "./config.service";


@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [ configLoader ]
    })
  ],
  providers: [
    ConfigService
  ],
  exports: [
    ConfigService
  ]
})
export class ConfigModule {}
