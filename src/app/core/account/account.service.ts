import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import dayjs from 'dayjs';
import fs from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import { APP_TEMPLATES_DIR_PATH } from '../../../config';
import { ConfigService } from '../../config/config.service';
import { UserEntity } from '../../entities/user.entity';
import { CryptoUtils } from '../../utils/crypto.utils';
import { ConfirmService } from '../confirm/confirm.service';
import { ConfirmUtils } from '../confirm/confirm.utils';
import { MailerService } from '../mailer/mailer.service';
import { ChangePasswordDTO, UserCreatedEvent, UserEmailDTO } from '../user/user.dto';
import { UserStatus } from '../user/user.enum';
import { UserService } from '../user/user.service';
import { UserUtils } from '../user/user.utils';
import { ActivateAccountDTO, CreateAccountDTO, UpdateAccountDTO } from './account.dto';


@Injectable()
export class AccountService {

  constructor(
    private readonly userService: UserService,
    private readonly confirmService: ConfirmService,
    private readonly emailService: MailerService,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2) {
  }


  public current(userId: number): Promise<UserEntity | null> {
    return this.userService.findById(userId);
  }


  public async create(dto: CreateAccountDTO) {
    UserUtils.validateEmail(dto.email);
    UserUtils.validatePassword(dto.password);

    const user = await this.userService.create({
      ...dto,
      status: UserStatus.PendingEmailConfirmation
    });
    this.eventEmitter.emit('user.created', new UserCreatedEvent(user.id));
    try {
      await this.sendEmailConfirmation(user);
    } catch (e) {
      await this.userService.remove(user.id);
      throw new InternalServerErrorException('Sorry, you cannot register at the moment because the mail server is unavailable.');
    }
  }


  public async activate(dto: ActivateAccountDTO) {
    UserUtils.validateEmail(dto.email);
    UserUtils.validateCode(dto.code);

    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException(`User with email: ${ dto.email } does not exists.`);
    }
    const confirm = await this.confirmService.findByCode(dto.code);
    ConfirmUtils.validate(confirm);

    await this.userService.update(user.id, {
      status: UserStatus.Activated
    });
    await this.confirmService.delete(confirm!.id);
  }


  public update(userId: number, dto: UpdateAccountDTO): Promise<UserEntity> {
    return this.userService.update(userId, dto);
  }


  public async delete(userId: number) {
    await this.userService.update(userId, { status: UserStatus.Deleted });
  }


  public async resendEmailConfirmation(email: string) {
    UserUtils.validateEmail(email);

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`The user with email ${ email } was not registered`);
    }
    try {
      await this.sendEmailConfirmation(user);
    } catch (e) {
      await this.userService.remove(user.id);
      throw new InternalServerErrorException('Sorry, you cannot register at the moment because the mail server is unavailable.');
    }
  }


  public async changeEmail(userId: number, dto: UserEmailDTO) {
    UserUtils.validateEmail(dto.email);

    if (await this.userService.findByEmail(dto.email)) {
      throw new BadRequestException(`User with email: ${ dto.email } exist`);
    }
    const user = await this.userService.update(userId, {
      email: dto.email,
      status: UserStatus.PendingEmailConfirmation
    });
    await this.sendEmailConfirmation(user);
    return user;
  }


  public async changePassword(userId: number, dto: ChangePasswordDTO) {
    const user = await this.userService.findById(userId);

    if (!CryptoUtils.compareHashes(dto.oldPassword, user!.password)) {
      throw new BadRequestException('The old password does not match');
    }
    await this.userService.updatePassword(userId, dto.newPassword);
  }


  public async sendEmailConfirmation(user: UserEntity): Promise<unknown> {
    const confirm = await this.confirmService.createEmailConfirmation(user.id, user.email);

    const html = fs.readFileSync(join(APP_TEMPLATES_DIR_PATH, 'welcome.hbs'), 'utf8');
    const template = Handlebars.compile(html);

    return this.emailService.send({
      subject: 'Account Email Confirmation ✔',
      from: `${ this.config.app.name } <${ this.config.mail.auth.user }>`,
      to: user.email,
      html: template({
        appName: this.config.app.name,
        username: 'Bro!',
        expired: dayjs(confirm.exp).format('MMMM D, YYYY h:mm A'),
        code: confirm.code
      })
    });
  }

}
