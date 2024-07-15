import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../../core/auth/guards/token.guard';
import { TokenPayload } from '../../decor/token.decorator';
import { JwtPayload } from '../../interfaces/jwt.interface';
import { CreateLoginDTO, LoginDTO, UpdateLoginDTO } from './login.dto';
import { LoginService } from './login.service';


@UseGuards(AccessTokenGuard)
@Controller('login')
export class LoginController {

  constructor(
    private readonly loginService: LoginService) {
  }


  @Post()
  async create(@Body() dto: CreateLoginDTO, @TokenPayload() payload: JwtPayload) {
    return this.loginService.create(dto, payload.sub)
      .then(value => plainToInstance(LoginDTO, value));
  }


  @Get()
  async findAll(@TokenPayload() payload: JwtPayload) {
    return this.loginService.findAll(payload.sub)
      .then(value => plainToInstance(LoginDTO, value));
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @TokenPayload() payload: JwtPayload) {
    return this.loginService.findOne(+id, payload.sub)
      .then(value => plainToInstance(LoginDTO, value));
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLoginDTO, @TokenPayload() payload: JwtPayload) {
    return this.loginService.update(+id, dto, payload.sub)
      .then(value => plainToInstance(LoginDTO, value));
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @TokenPayload() payload: JwtPayload) {
    return this.loginService.remove(+id, payload.sub);
  }
}
