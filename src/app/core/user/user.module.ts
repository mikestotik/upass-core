import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ UserEntity ]),
    RoleModule,
    ConfigModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService
  ],
  exports: [
    UserService,
    TypeOrmModule
  ]
})
export class UserModule {}


// id: 1572137940142153700,
//   id_str: '1572137940142153735',