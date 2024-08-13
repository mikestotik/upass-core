import { Exclude } from 'class-transformer';
import { DBEntityDTO } from '../../../database/database.dto';
import { UserDTO } from '../user/user.dto';
import { OtpType } from './otp.enum';


export class CreateOtpDTO<T = object> {
  code!: number;
  type!: OtpType;
  data?: T;
  exp!: Date;
}


export class OtpDto<T = object> extends DBEntityDTO {
  type!: OtpType;
  data?: T;
  exp!: Date;

  @Exclude()
  code!: number;

  @Exclude()
  owner: UserDTO;
}
