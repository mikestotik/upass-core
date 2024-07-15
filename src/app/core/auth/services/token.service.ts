import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../config/config.service';
import { Role } from '../../role/role.enum';
import { UserEntity } from '../../../entities/user.entity';


@Injectable()
export class TokenService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService) {
  }


  public createRefreshToken(user: UserEntity): string {
    const roles = user.roles?.map(i => i.title as Role);

    return this.jwtService.sign(
      { sub: user.id, email: user.email, roles },
      {
        secret: this.config.auth.jwt.refresh.secret,
        expiresIn: this.config.auth.jwt.refresh.ttl
      }
    );
  }


  public createAccessToken(user: UserEntity): string {
    const roles = user.roles?.map(i => i.title as Role);

    return this.jwtService.sign(
      { sub: user.id, email: user.email, roles },
      {
        secret: this.config.auth.jwt.access.secret,
        expiresIn: this.config.auth.jwt.access.ttl
      }
    );
  }
}