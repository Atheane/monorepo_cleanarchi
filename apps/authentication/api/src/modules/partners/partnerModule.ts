import { Container } from 'inversify';
import { PartnerController } from './partner.controller';

export function buildPartnerModule(container: Container) {
  container.bind(PartnerController).to(PartnerController);
}
