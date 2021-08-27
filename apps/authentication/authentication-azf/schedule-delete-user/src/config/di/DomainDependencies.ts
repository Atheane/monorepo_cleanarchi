import { UserRepository } from '../../core/domain/repositories/UserRepository';
import { DeleteUsers } from '../../core/usecases/DeleteUsers';

export interface DomainDependencies {
  deleteUsers: DeleteUsers;
  userRepository: UserRepository;
}
