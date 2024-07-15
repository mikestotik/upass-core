import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  AppConfig,
  AuthConfig,
  ClientConfig,
  CryptoConfig,
  DatabaseConfigOptions,
  GoogleConfig,
  MailConfig,
  ServerConfig,
} from './config.interface';


@Injectable()
export class ConfigService {

  public readonly app: AppConfig;
  public readonly server: ServerConfig;
  public readonly database: DatabaseConfigOptions;
  public readonly auth: AuthConfig;
  public readonly crypto: CryptoConfig;
  public readonly mail: MailConfig;

  public readonly google: GoogleConfig;
  public readonly client: ClientConfig;


  constructor(config: NestConfigService) {

    this.app = config.get('app') as AppConfig;
    this.server = config.get('server') as ServerConfig;
    this.database = config.get('database') as DatabaseConfigOptions;
    this.auth = config.get('auth') as AuthConfig;
    this.crypto = config.get('crypto') as CryptoConfig;
    this.mail = config.get('mail') as MailConfig;

    this.google = config.get('google') as GoogleConfig;
    this.client = config.get('client') as ClientConfig;
  }
}
