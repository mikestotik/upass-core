import { PartialType } from '@nestjs/mapped-types';


export class CreateLoginDTO {
  title!: string;
  username!: string;
  password!: string;
  totp?: string;
  url?: string;
  notes?: string;
  logo?: string;
  favorite?: boolean;
}


export class UpdateLoginDTO extends PartialType(CreateLoginDTO) {}


export class LoginDTO {
  id!: string;
  title!: string;
  username!: string;
  password!: string;
  totp?: string;
  url?: string;
  notes?: string;
  logo?: string;
  favorite?: boolean;
  created!: Date;
  updated!: Date;
}
