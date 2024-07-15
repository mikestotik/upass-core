import { UserEntity } from '../../entities/user.entity';


export class SignInResponseDTO {
  accessToken!: string;
  refreshToken!: string;
  message?: string;
  user!: UserEntity;
}


export class RefreshTokenResponseDTO {
  accessToken!: string;
}