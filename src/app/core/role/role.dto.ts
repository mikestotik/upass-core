import { PartialType } from '@nestjs/mapped-types';


export class CreateRoleDTO {
  id?: number;
  title!: string;
}


export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}


export class RoleDTO {
  id!: number;
  title!: string;
}
