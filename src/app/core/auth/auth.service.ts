import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { UserStatus } from '../user/user.enum';
import { RandomUtils } from '../../utils/random.utils';
import { OtpService } from '../otp/otp.service';
import { OtpUtils } from '../otp/otp.utils';
import { MailerService } from '../mailer/mailer.service';
import { UserCredentialsDTO, UserEmailDTO, UserPasswordUpdateDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { UserUtils } from '../user/user.utils';
import { RefreshTokenResponseDTO, SignInResponseDTO } from './auth.dto';
import { TokenService } from './services/token.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly emailService: MailerService,
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService) {
  }


  public async login(credentials: UserCredentialsDTO): Promise<SignInResponseDTO> {
    UserUtils.validateEmail(credentials.email);
    UserUtils.validatePassword(credentials.password);

    const user = await this.userService.validateUser(credentials.email, credentials.password);

    const accessToken = this.tokenService.createAccessToken(user);
    const refreshToken = this.tokenService.createRefreshToken(user);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    const isDeleted = user.status === UserStatus.Deleted;
    const message = isDeleted ? 'Account restored!' : undefined;
    if (isDeleted) {
      await this.userService.update(user.id, { status: UserStatus.Activated });
    }
    return {
      accessToken,
      refreshToken,
      message,
      user
    };
  }


  public async loginWithStrategy(email: string, fullName?: string) {
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({
        email,
        password: RandomUtils.generatePassword(),
        fullName,
        status: UserStatus.Activated
      });
    }
    const authAccessToken = this.tokenService.createAccessToken(user);
    const authRefreshToken = this.tokenService.createRefreshToken(user);

    await this.userService.updateRefreshToken(user.id, authRefreshToken);
    return {
      accessToken: authAccessToken,
      refreshToken: authRefreshToken,
      user
    } as SignInResponseDTO;
  }


  public async logout(userId: number) {
    return this.userService.updateRefreshToken(userId, undefined);
  }


  public async refreshAccessToken(userId: number): Promise<RefreshTokenResponseDTO> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return { accessToken: this.tokenService.createAccessToken(user) };
  }


  public async resetPassword(payload: UserEmailDTO): Promise<void> {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new NotFoundException(`User with email: ${ payload.email } not found.`);
    }
    const confirm = await this.otpService.createEmailConfirmation(user.id, user.email);
    await this.userService.updatePassword(user.id, RandomUtils.generatePassword());
    await this.sendResetPasswordEmail(payload.email, confirm.code);
  }


  public async updatePassword(payload: UserPasswordUpdateDTO) {
    const confirm = await this.otpService.findByCode(payload.code);

    OtpUtils.validate(confirm);
    UserUtils.validatePassword(payload.password);

    await this.userService.updatePassword(confirm!.owner.id, payload.password);
  }


  private sendResetPasswordEmail(email: string, code: number): Promise<unknown> {
    const link = `${ this.config.client.web.url }${ this.config.client.web.updatePassword }/${ code }`;

    return this.emailService.send({
      subject: 'Reset Password ✔',
      from: `${ this.config.app.name } <${ this.config.mail.auth.user }>`,
      to: email,
      text: `It seems like you forgot your password for ${ this.config.app.name }. If this is true, click the link below to reset your password. \nReset my password: ${ link } \n\nIf you did not forget your password, please disregard this email.`
    });
  }
}