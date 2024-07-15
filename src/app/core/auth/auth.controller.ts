import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { TokenPayload } from '../../decor/token.decorator';
import { JwtPayload } from '../../interfaces/jwt.interface';
import { UserCredentialsDTO, UserEmailDTO, UserPasswordUpdateDTO } from '../user/user.dto';
import { SignInResponseDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from './guards/token.guard';


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService) {
  }


  @Post('login')
  public login(@Body() credentials: UserCredentialsDTO): Promise<SignInResponseDTO> {
    return this.authService.login(credentials);
  }


  @Post('reset-password')
  public resetPassword(@Body() payload: UserEmailDTO) {
    return this.authService.resetPassword(payload);
  }


  @Post('update-password')
  public updatePassword(@Body() payload: UserPasswordUpdateDTO) {
    return this.authService.updatePassword(payload);
  }


  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  public refreshAccessToken(@TokenPayload() payload: JwtPayload, @Headers() headers: IncomingHttpHeaders) {
    return this.authService.refreshAccessToken(payload.sub);
  }


  @UseGuards(AccessTokenGuard)
  @Get('logout')
  public logout(@TokenPayload() payload: JwtPayload) {
    return this.authService.logout(payload.sub);
  }
}