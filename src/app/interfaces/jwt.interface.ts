import { Role } from '../core/role/role.enum';


export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  roles: Role[];
}
