import { Container } from 'inversify';
import { ProfileMapper } from './ProfileMapper';

export function buildMappersModules(container: Container) {
  container.bind(ProfileMapper).toSelf();
}
