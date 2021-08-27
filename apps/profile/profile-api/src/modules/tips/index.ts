import { Container } from 'inversify';
import { TipsController } from './TipsController';

export function buildTipsModule(container: Container) {
  container.bind(TipsController).to(TipsController);
}
