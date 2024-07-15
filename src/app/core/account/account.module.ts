import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { ConfirmModule } from '../confirm/confirm.module';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';


@Module({
  imports: [
    UserModule,
    ConfirmModule,
    ConfigModule,
    MailerModule
  ],
  controllers: [
    AccountController
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule {}
