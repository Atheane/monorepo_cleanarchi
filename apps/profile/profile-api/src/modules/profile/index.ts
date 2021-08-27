import { Container } from 'inversify';
import { ProfileController } from './ProfileController';

export function buildProfileModule(container: Container) {
  container.bind(ProfileController).to(ProfileController);
}
