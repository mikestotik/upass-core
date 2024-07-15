import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards/token.guard';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from './user.dto';
import { UserService } from './user.service';


@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService) {
  }


  @Get()
  public async findAll() {
    return this.userService.findAll()
      .then(value => plainToInstance(UserDTO, value));
  }


  @Get(':id')
  public async findById(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    return this.userService.findOne(id)
      .then(value => plainToInstance(UserDTO, value));
  }


  @Post()
  public async create(@Body() dto: CreateUserDTO): Promise<UserDTO> {
    return this.userService.create(dto)
      .then(value => plainToInstance(UserDTO, value));
  }


  @Patch(':id')
  public async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDTO): Promise<UserDTO> {
    return this.userService.update(id, dto)
      .then(value => plainToInstance(UserDTO, value));
  }


  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}