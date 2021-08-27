import { Container } from 'inversify';
import { BankController } from './BankController';
import { BankMapper } from './mappers';

export function buildBankModule(container: Container): void {
  container.bind(BankController).toSelf();
  container.bind(BankMapper).toSelf();
}
