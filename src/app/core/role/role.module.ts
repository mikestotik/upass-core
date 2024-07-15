import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { RoleController } from './role.controller';
import { Role } from './role.enum';
import { RoleService } from './role.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ RoleEntity ])
  ],
  controllers: [
    RoleController
  ],
  providers: [
    RoleService
  ],
  exports: [
    RoleService,
    TypeOrmModule
  ]
})
export class RoleModule implements OnModuleInit {

  constructor(
    private readonly roleService: RoleService) {
  }


  async onModuleInit() {
    if (!await this.roleService.findByRole(Role.System)) {
      await this.roleService.create({ id: 1, title: Role.System });
    }
    if (!await this.roleService.findByRole(Role.User)) {
      await this.roleService.create({ id: 2, title: Role.User });
    }
  }
}
