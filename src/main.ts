import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import { AppModule } from './app/app.module';
import { ConfigService } from './app/config/config.service';
import { showBootstrapInfoMessage } from './app/utils/bootstrap.utils';
import { SocketIoAdapter } from './app/websocket/websocket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.server.api.globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: config.server.cors.origin,
  });

  app.use(bodyParser.json({ limit: config.server.uploads.maxSize }));
  app.use(
    bodyParser.urlencoded({
      limit: config.server.uploads.maxSize,
      extended: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.server.api.version,
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app, config.server));

  await app
    .listen(config.server.port, config.server.host)
    .then(() => app.getUrl())
    .then((url) => showBootstrapInfoMessage(config, url));
}

bootstrap();
