import { Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { ConfigService } from '../../config/config.service';


@Injectable()
export class MailerService {

  private readonly transporter: Transporter<SentMessageInfo>;


  constructor(
    private readonly config: ConfigService) {

    this.transporter = createTransport({
      host: this.config.mail.host,
      port: this.config.mail.port,
      secure: this.config.mail.secure,
      debug: this.config.mail.debug,
      logger: this.config.mail.logger,
      auth: this.config.mail.auth
    });
  }


  public send(options: Options): Promise<unknown> {
    return this.transporter.sendMail(options);
  }
}