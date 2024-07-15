import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards/token.guard';
import { CreateRoleDTO, RoleDTO, UpdateRoleDTO } from './role.dto';
import { RoleService } from './role.service';


@UseGuards(AccessTokenGuard)
@Controller('roles')
export class RoleController {

  constructor(
    private readonly roleService: RoleService) {
  }


  @Post()
  public async create(@Body() dto: CreateRoleDTO): Promise<RoleDTO> {
    return this.roleService.create(dto)
      .then(value => plainToInstance(RoleDTO, value));
  }


  @Get()
  public async findAll(): Promise<RoleDTO[]> {
    return this.roleService.findAll()
      .then(entities => plainToInstance(RoleDTO, entities));
  }


  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleDTO> {
    return this.roleService.findOne(id)
      .then(value => plainToInstance(RoleDTO, value));
  }


  @Patch(':id')
  public async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDTO): Promise<unknown> {
    return this.roleService.update(id, dto)
      .then(value => plainToInstance(RoleDTO, value));
  }


  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roleService.remove(id);
  }
}
