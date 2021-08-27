import { Container } from 'inversify';
import { buildHealthCheckModule } from './healthcheck';
import { buildMappersModules } from './mappers';
import { buildKycModule } from './onboarding';
import { buildProfileModule } from './profile';
import { buildResourcesModule } from './resources';
import { buildTipsModule } from './tips';
import { buildContractModule } from './contract';
import { buildCustomerServiceModule } from './customerService';

export function buildModules(container: Container) {
  buildProfileModule(container);
  buildTipsModule(container);
  buildHealthCheckModule(container);
  buildKycModule(container);
  buildResourcesModule(container);
  buildMappersModules(container);
  buildContractModule(container);
  buildCustomerServiceModule(container);
}
