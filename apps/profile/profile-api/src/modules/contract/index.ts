import { Container } from 'inversify';
import { ContractController } from './ContractController';

export function buildContractModule(container: Container) {
  container.bind(ContractController).toSelf();
}
