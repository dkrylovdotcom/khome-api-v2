// TODO:: looks pretty strange
import dotenv = require('dotenv');
dotenv.config();

// TODO:: looks pretty strange
process.env['NODE_CONFIG_DIR'] = __dirname + '/../config/';

import * as config from 'config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './AppModule';

const { ip, port } = config.get('app.webServer');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('HOME API')
    .setDescription(`HOME API`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, ip);
}

bootstrap();
