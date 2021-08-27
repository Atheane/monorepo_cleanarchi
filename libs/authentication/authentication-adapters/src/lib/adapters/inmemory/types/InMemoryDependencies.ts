import { InMemoryStorage } from './InMemoryStorage';
import { AuthenticationBuildDependencies } from '../../../di/AuthenticationBuildDependencies';

export interface InMemoryDependencies {
  (inMemoryStorage: InMemoryStorage): Promise<AuthenticationBuildDependencies>;
}
