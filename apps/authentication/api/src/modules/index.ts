import { Container } from 'inversify';
import { buildAuthModule } from './auth/AuthModule';
import { buildHealthCheckModule } from './healthcheck';
import { buildPartnerModule } from './partners/partnerModule';
import { buildProvisionningModule } from './provisionning/ProvisionningModule';
import { buildRegisterModule } from './register/register.module';
import { buildScaModule } from './sca/scaModule';
import { buildUserModule } from './user/userModule';

export function buildModules(container: Container): void {
  buildScaModule(container);
  buildAuthModule(container);
  buildRegisterModule(container);
  buildHealthCheckModule(container);
  buildUserModule(container);
  buildProvisionningModule(container);
  buildPartnerModule(container);
}
