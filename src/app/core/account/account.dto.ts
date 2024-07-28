import { UserCredentialsDTO } from '../user/user.dto';


export class CreateAccountDTO extends UserCredentialsDTO {
  lang?: string;
}


export interface AccountCreatedDTO {
  needConfirm: boolean;
}


export class ActivateAccountDTO {
  email: string;
  code: number;
}


export class UpdateAccountDTO {
  fullName?: string;
  logo?: string;
  lang?: string;
}