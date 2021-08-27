import { DomainEventHandler } from '@oney/ddd';
import { UserDeleted } from '@oney/authentication-messages';
import { injectable } from 'inversify';
import { DeleteUser, DeleteUserCommand } from '../../usecases/users/DeleteUser';

@injectable()
export class UserDeletedHandler extends DomainEventHandler<UserDeleted> {
  private readonly usecase: DeleteUser;

  constructor(usecase: DeleteUser) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: UserDeleted): Promise<void> {
    const { uid } = domainEvent.props;
    console.log(`Received USER_DELETED for userId ${uid}`);
    const deleteUserCommand: DeleteUserCommand = {
      userId: uid,
    };

    await this.usecase.execute(deleteUserCommand);
  }
}
