import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Transform } from 'class-transformer';
import { DBEntityDTO } from '../../../database/database.dto';
import { RoleDTO } from '../role/role.dto';
import { Role } from '../role/role.enum';
import { UserStatus } from './user.enum';


export class UserEmailDTO {
  email!: string;
}


export class UserPasswordDTO {
  password!: string;
}


export class UserCredentialsDTO implements UserEmailDTO, UserPasswordDTO {
  email!: string;
  password!: string;
}


export class UserPasswordUpdateDTO implements UserPasswordDTO {
  code!: number;
  password!: string;
}


export class CreateUserDTO implements UserCredentialsDTO {
  email!: string;
  password!: string;
  fullName?: string;
  logo?: string;
  status?: UserStatus;
}


export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  email?: string;
  fullName?: string;
  logo?: string;

  @Exclude()
  password!: string;

  @Exclude()
  roles?: Role[];
}


export class ChangePasswordDTO {
  oldPassword!: string;
  newPassword!: string;
}


export class ChangeEmailDTO {
  email!: string;
}


export class UserDTO extends DBEntityDTO {
  email!: string;
  fullName!: string;
  logo!: string;
  status!: UserStatus;

  @Exclude()
  password!: string;

  @Exclude()
  refreshToken!: string;

  @Transform(({ value }) => value.map((role: RoleDTO) => role.title))
  roles!: RoleDTO[];
}


export class UserCreatedEvent {
  constructor(
    public readonly userId: number) {
  }
}