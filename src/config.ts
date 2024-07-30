import fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as process from 'process';
import { ConfigService } from './app/config/config.service';
import { mergeDeep } from './app/config/config.utils';
import { showBanner } from './app/utils/bootstrap.utils';

export const APP_ROOT_PATH = __dirname;
export const APP_CONFIG_DIR_NAME = 'config';
export const APP_CONFIG_FILE_NAME = 'application.yml';
export const APP_ENV = process.env.NODE_ENV;
export const APP_ENV_CONFIG_FILE_NAME = `application${ APP_ENV ? '.' + APP_ENV : '' }.yml`;

export const APP_BANNER_FILE_PATH = join(__dirname, 'assets', 'banner.txt');
export const APP_TEMPLATES_DIR_PATH = join(__dirname, 'assets', 'templates');

const mainConfigPath = join(
  APP_ROOT_PATH,
  APP_CONFIG_DIR_NAME,
  APP_CONFIG_FILE_NAME,
);
const mainConfigYaml = fs.readFileSync(mainConfigPath, 'utf8');
const mainConfig = yaml.load(mainConfigYaml) as object;

const envConfigPath = join(
  APP_ROOT_PATH,
  APP_CONFIG_DIR_NAME,
  APP_ENV_CONFIG_FILE_NAME,
);
const envConfigYaml = fs.readFileSync(envConfigPath, 'utf8');
const envConfig = yaml.load(envConfigYaml) || {};

const config = mergeDeep(mainConfig, envConfig) as Record<string, any>;

showBanner(config as ConfigService);

export default () => {
  return config;
};
