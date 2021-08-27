import { Container } from 'inversify';
import { buildAuthModule } from './auth';
import { buildBankModule } from './bank';
import { buildBankConnectionModule } from './bankConnection';
import { buildHealthCheckModule } from './healthcheck';
import { buildUserModule } from './user';
import { buildTermsModule } from './terms';
import { buildCreditProfileModule } from './creditProfile';

export function buildModules(container: Container): void {
  buildHealthCheckModule(container);
  buildBankModule(container);
  buildAuthModule(container);
  buildUserModule(container);
  buildBankConnectionModule(container);
  buildTermsModule(container);
  buildCreditProfileModule(container);
}
