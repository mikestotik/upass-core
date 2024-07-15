import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';
import { ConfigService } from '../../config/config.service';


@Controller('auth/google')
export class GoogleController {

  private readonly logger = new Logger(GoogleController.name);


  constructor(
    private readonly config: ConfigService) {
  }


  @Get()
  @UseGuards(AuthGuard('google'))
  public googleLogin(): void {
    this.logger.log('Initiates the Google OAuth2 login flow');
  }


  @Get('callback')
  @UseGuards(AuthGuard('google'))
  public googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Handles the Google OAuth2 callback');

    res.redirect(`${ this.config.client.web.url }${ this.config.client.web.ssoRedirectRoute }/${ req.user }`);
  }
}