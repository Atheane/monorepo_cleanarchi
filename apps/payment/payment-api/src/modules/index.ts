import { Container } from 'inversify';
import { buildCardsModule } from './accounts/cards';
import { buildDebtModule } from './accounts/debts';
import { buildHealthcheckModule } from './healthcheck';
import { buildPaymentModule } from './payments';
import { buildTransferModule } from './transfer';
import { buildUserModule } from './user';
import { buildLimitsModule } from './accounts/limits';

export function buildModules(container: Container) {
  // Here you register every module of your app.
  buildHealthcheckModule(container);
  buildPaymentModule(container);
  buildTransferModule(container);
  buildCardsModule(container);
  buildUserModule(container);
  buildDebtModule(container);
  buildLimitsModule(container);
}
