import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TokenPayload } from '../../decor/token.decorator';
import { JwtPayload } from '../../interfaces/jwt.interface';

import { AccessTokenGuard } from '../auth/guards/token.guard';
import { ChangePasswordDTO, UserDTO, UserEmailDTO, UserMasterPasswordDTO } from '../user/user.dto';
import { ActivateAccountDTO, CreateAccountDTO, UpdateAccountDTO } from './account.dto';
import { AccountService } from './account.service';


@Controller('account')
export class AccountController {

  constructor(
    private readonly accountService: AccountService) {
  }


  @UseGuards(AccessTokenGuard)
  @Get()
  public async current(@TokenPayload() payload: JwtPayload): Promise<UserDTO> {
    return this.accountService.current(payload.sub)
      .then(value => plainToInstance(UserDTO, value));
  }


  @Post()
  public create(@Body() dto: CreateAccountDTO) {
    return this.accountService.create(dto);
  }


  @UseGuards(AccessTokenGuard)
  @Patch()
  public async update(@TokenPayload() payload: JwtPayload, @Body() dto: UpdateAccountDTO) {
    return this.accountService.update(payload.sub, dto)
      .then(value => plainToInstance(UserDTO, value));
  }


  @Post('activate')
  public activate(@Body() dto: ActivateAccountDTO) {
    return this.accountService.activate(dto);
  }


  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  public async changePassword(@TokenPayload() payload: JwtPayload, @Body() dto: ChangePasswordDTO) {
    return this.accountService.changePassword(payload.sub, dto);
  }


  @UseGuards(AccessTokenGuard)
  @Post('change-email')
  public async changeEmail(@TokenPayload() payload: JwtPayload, @Body() dto: UserEmailDTO) {
    return this.accountService.changeEmail(payload.sub, dto)
      .then(value => plainToInstance(UserDTO, value));
  }


  @Post('resend-email')
  public resendEmail(@Body() dto: UserEmailDTO) {
    return this.accountService.resendEmailConfirmation(dto.email);
  }


  @UseGuards(AccessTokenGuard)
  @Post('master-password')
  public setMasterPassword(@Body() dto: UserMasterPasswordDTO, @TokenPayload() payload: JwtPayload) {
    return this.accountService.setMasterPassword(dto.masterPassword, payload.sub);
  }


  @UseGuards(AccessTokenGuard)
  @Delete()
  public async delete(@TokenPayload() payload: JwtPayload) {
    return this.accountService.delete(payload.sub);
  }

}