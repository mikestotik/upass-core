import fs from 'fs';
import { APP_BANNER_FILE_PATH, APP_ENV } from '../../config';
import { ConfigService } from '../config/config.service';


export const showBanner = (config: ConfigService) => {
  const banner = fs.readFileSync(APP_BANNER_FILE_PATH, 'utf8');

  console.info(banner
    .replace('{version}', config.app.version)
  );
};

export const showBootstrapInfoMessage = (config: ConfigService, url: string) => {
  console.info(`
----------------------------------------------------------\t
Application: \t${ config.app.name } is running!\t
Url: \t\t${ url }\t
Profile(s): \t${ APP_ENV }
----------------------------------------------------------
`);
};