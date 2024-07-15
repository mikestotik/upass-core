import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { DBEntityDTO } from '../../../database/database.dto';
import { UserDTO } from '../user/user.dto';
import { ConfirmType } from './confirm.enum';


export class CreateConfirmDTO<T = object> {
  code!: number;
  type!: ConfirmType;
  data?: T;
  exp!: Date;
}


export class UpdateConfirmDTO extends PartialType(CreateConfirmDTO) {}


export class ConfirmDTO<T = object> extends DBEntityDTO {
  type!: ConfirmType;
  data?: T;
  exp!: Date;

  @Exclude()
  code!: number;

  @Exclude()
  owner: UserDTO;
}
