import { Container } from 'inversify';
import { ProvisionningController, useExtraFeature } from './ProvisionningController';
import { BasicAuthMiddleware } from './middlewares/BasicAuthMiddleware';
import { envConfiguration } from '../../config/server/Envs';

export function buildProvisionningModule(container: Container) {
  container
    .bind<boolean>(useExtraFeature)
    .toConstantValue(envConfiguration.getLocalVariables().useExtraProvisionningFeature);
  container.bind(BasicAuthMiddleware).to(BasicAuthMiddleware);
  container.bind(ProvisionningController).to(ProvisionningController);
}
