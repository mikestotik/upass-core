import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '../../config/config.service';
import { AuthStrategy } from '../../interfaces/auth.interface';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') implements AuthStrategy {

  constructor(
    config: ConfigService,
    private readonly authService: AuthService) {

    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: config.google.scope
    });
  }


  public async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
    const email = this.getProfileEmail(profile);
    const tokens = await this.authService.loginWithStrategy(email, profile.displayName);

    cb(null, btoa(JSON.stringify(tokens)));
  }


  private getProfileEmail(profile: Profile): string {
    const email = profile.emails?.find(i => i.verified);
    if (!email) {
      throw new ForbiddenException('Email is not verified.');
    }
    return email.value;
  }
}