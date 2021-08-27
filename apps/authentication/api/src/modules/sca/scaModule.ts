import { Container } from 'inversify';
import { ScaController } from './scaController';

export function buildScaModule(container: Container) {
  container.bind(ScaController).to(ScaController);
}
