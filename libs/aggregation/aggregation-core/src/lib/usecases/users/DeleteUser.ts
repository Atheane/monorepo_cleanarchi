import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { BankConnectionGateway, UserRepository, UserGateway, BankAccountGateway } from '../../domain';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';

export interface DeleteUserCommand {
  userId: string;
}

@injectable()
export class DeleteUser implements Usecase<DeleteUserCommand, void> {
  constructor(
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.bankConnectionGateway)
    private readonly bankConnectionGateway: BankConnectionGateway,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(AggregationIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
  ) {}

  async execute(request: DeleteUserCommand): Promise<void> {
    const { userId } = request;

    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);

    // add bankConnection to AggregateRoot User
    const bankConnections = await this.bankConnectionRepository.filterBy({ userId });

    await Promise.all(
      bankConnections.map(async bankConnection => {
        const bankAccounts = await this.bankAccountGateway.getAccountsFromRefId(bankConnection.props.refId);
        // add bankAccounts to AggregateRoot BankConnection
        bankConnection.setBankAccounts(bankAccounts);
      }),
    );
    user.update({ bankConnections });

    await Promise.all(
      user.props.bankConnections.map(async bankConnection => {
        await this.bankConnectionRepository.deleteOne(bankConnection.props.connectionId);
        await this.bankConnectionGateway.deleteOne(bankConnection.props.refId); // check if this is necessary
      }),
    );

    await this.userRepository.deleteOne(user.props.userId);
    await this.userGateway.deleteOne();

    user.delete();

    await Promise.all(
      user.props.bankConnections.map(async bankConnection => {
        await this.eventDispatcher.dispatch(bankConnection);
      }),
    );
  }
}
