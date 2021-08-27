import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Application } from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { IDocumentationConfiguration } from './IDocumentationConfig';

export function configureDocumentation(app: Application, config: IDocumentationConfiguration): void {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
  });
  const { prefix } = config;
  const metadataStorage = getMetadataArgsStorage();
  const components = { schemas };
  const documentationProperties = { ...config, components };
  const spec = routingControllersToSpec(metadataStorage, {}, documentationProperties);
  app.use(`${prefix}/docs`, swaggerUi.serve);
  app.get(`${prefix}/docs`, swaggerUi.setup(spec));
}

export function setupDocumentation(app: Application): void {
  const DOCUMENTATION_APP_NAME = 'Aggregation';
  const DOCUMENTATION_TITLE = 'Open Api documentation';
  const DOCUMENTATION_VERSION = '1.0';
  const documentationConfig: IDocumentationConfiguration = {
    prefix: '/aggregation',
    title: `${DOCUMENTATION_APP_NAME} ${DOCUMENTATION_TITLE}`,
    version: DOCUMENTATION_VERSION,
  };
  configureDocumentation(app, documentationConfig);
}
