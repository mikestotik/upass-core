import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../config/config.service';
import { AuthStrategy } from '../../../interfaces/auth.interface';
import { JwtPayload } from '../../../interfaces/jwt.interface';


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') implements AuthStrategy {

  constructor(
    private readonly config: ConfigService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.jwt.access.secret
    });
  }


  public validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}