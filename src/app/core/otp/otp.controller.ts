import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TokenPayload } from '../../decor/token.decorator';
import { JwtPayload } from '../../interfaces/jwt.interface';
import { AccessTokenGuard } from '../auth/guards/token.guard';
import { OtpDto } from './otp.dto';
import { OtpService } from './otp.service';


@Controller('otp')
export class OtpController {

  constructor(
    private readonly otpService: OtpService) {
  }


  @UseGuards(AccessTokenGuard)
  @Get()
  public async findAllForUser(@TokenPayload() payload: JwtPayload) {
    return this.otpService.findByOwner(payload.sub)
      .then(value => plainToInstance(OtpDto, value));
  }


  @Get('otp/:confirm')
  public async confirm(@Param('code', ParseIntPipe) code: number) {
    return this.otpService.confirm(code);
  }


  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number, @TokenPayload() payload: JwtPayload) {
    return this.otpService.deleteByIdAndOwner(id, payload.sub);
  }
}
