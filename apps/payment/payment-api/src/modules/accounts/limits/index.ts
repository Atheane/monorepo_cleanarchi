import { Container } from 'inversify';
import { LimitsController } from './controllers/LimitsController';

export function buildLimitsModule(container: Container) {
  container.bind(LimitsController).to(LimitsController);
}
