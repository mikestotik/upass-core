import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { ROLES_KEY } from '../../../decor/roles.decorator';
import { RequestUtils } from '../../../utils/request.utils';
import { Role } from '../../role/role.enum';


@Injectable()
export class RolesGuard implements CanActivate {

  private static getAuthorizationRoles(authorization: string): Role[] {
    const token = RequestUtils.getAuthorizationBearerToken(authorization);
    if (!token) {
      throw new ForbiddenException('Access Denied: Bearer token not found');
    }
    const payload = decode(token) as JwtPayload;
    return payload.roles;
  }


  constructor(
    private reflector: Reflector) {
  }


  public canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass()
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { header } = ctx.switchToHttp().getRequest() as Request;
    const roles = RolesGuard.getAuthorizationRoles(header('authorization')!);

    const exists = requiredRoles.some((role) => roles.includes(role));
    if (!exists) {
      throw new ForbiddenException(`This resource requires the following roles: [${ requiredRoles }]`);
    }
    return exists;
  }

}
