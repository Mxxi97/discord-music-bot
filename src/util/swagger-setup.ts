import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readPackageInfo } from './read-package-info';

export function setupSwagger(app: INestApplication<any>) {
  const packageInfo = readPackageInfo();

  const options = new DocumentBuilder()
    //read name from package.json
    .setTitle(packageInfo.name)
    .setDescription(`The ${packageInfo.name} API description`)
    .setVersion(packageInfo.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    customCssUrl: '/swagger-ui-dark.css',
  });
}
