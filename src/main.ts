import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Retrieve ConfigService
  const configService = app.get(ConfigService);

  // Enable project cors
  app.enableCors(configService.get('cors'));

  setupSwagger(app, configService);

  await app.listen(
      Number(configService.get('app.port'))
  );
}

function setupSwagger(app: INestApplication, configService: ConfigService) {
  if (configService.get('app.swagger')) {
    const config = new DocumentBuilder()
        .setTitle('Facebook API')
        .setDescription('The Facebook API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}

bootstrap();
