import { inject, injectable } from 'inversify';
import { DomainEventHandler } from '@oney/ddd';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { Identifiers, UpdateProfileStatus } from '@oney/profile-core';
import { SymLogger, Logger } from '@oney/logger-core';

@injectable()
export class UpdateProfileStatusCommandHandler extends DomainEventHandler<UpdateProfileStatusCommand> {
  constructor(
    @inject(Identifiers.updateProfileStatus) private readonly updateProfileStatus: UpdateProfileStatus,
    @inject(SymLogger) private readonly logger: Logger,
  ) {
    super();
  }

  async handle(command: UpdateProfileStatusCommand): Promise<void> {
    this.logger.info('Received UpdateProfileStatusCommand', command);
    await this.updateProfileStatus.execute(command);
  }
}
