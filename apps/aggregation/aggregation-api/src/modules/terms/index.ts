import { Container } from 'inversify';
import { TermsController } from './TermsController';

export function buildTermsModule(container: Container): void {
  container.bind(TermsController).toSelf();
}
