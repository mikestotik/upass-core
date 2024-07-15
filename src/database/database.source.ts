import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DatabaseConfigOptions } from '../app/config/config.interface';
import config from '../config';


const dsc = config().database as DatabaseConfigOptions;


export const AppDataSource = new DataSource({
  type: dsc.type,
  url: dsc.url,
  host: dsc.host,
  port: dsc.port ? dsc.port : 5432,
  username: dsc.username,
  password: dsc.password,
  database: dsc.name,
  dropSchema: dsc.dropSchema,
  keepConnectionAlive: true,
  logging: dsc.logging,
  synchronize: dsc.synchronize,
  autoLoadEntities: true,
  entities: [ __dirname + '/../**/*.entity{.ts,.js}' ],
  migrations: [ __dirname + '/migrations/**/*{.ts,.js}' ],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber'
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: dsc.maxConnections ? dsc.maxConnections : 100,
    ssl: dsc?.ssl?.enabled
      ? {
        rejectUnauthorized: dsc.ssl.rejectUnauthorized,
        ca: dsc.ssl.ca ?? undefined,
        key: dsc.ssl.key ?? undefined,
        cert: dsc.ssl.cert ?? undefined
      }
      : undefined
  },
  namingStrategy: new SnakeNamingStrategy()
} as DataSourceOptions);
