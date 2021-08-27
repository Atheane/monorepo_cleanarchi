import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { ProfileCreated } from '@oney/profile-messages';
import {
  FolderGateway,
  GetUserInfos,
  Identifiers,
  IdGenerator,
  ProfileRepositoryWrite,
} from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { EventProducerDispatcher } from '@oney/messages-core';

@injectable()
export class ProfileCreatedHandler extends DomainEventHandler<ProfileCreated> {
  constructor(
    private readonly _getProfileById: GetUserInfos,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.folderGateway) private readonly _folderGateway: FolderGateway,
    @inject(Identifiers.idGenerator) private readonly _idGenerator: IdGenerator,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: ProfileCreated): Promise<void> {
    this._logger.info(`handling ProfileCreated event`, domainEvent);
    const {
      props: { phone },
      metadata,
    } = domainEvent;
    if (phone) {
      const profile = await this._getProfileById.execute({
        uid: metadata.aggregateId,
      });
      const now = new Date();
      // To keep consistency with legacy we keep the same case reference construction
      const caseReference = `SP_${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${
        metadata.aggregateId
      }_${this._idGenerator.generateUniqueID()}`;

      const createdFolder = await this._folderGateway.create({
        caseReference,
        masterReference: profile.props.uid,
        email: profile.props.email,
        phone: phone,
      });

      profile.validatePhoneStep(phone, caseReference, createdFolder.location);

      await this._profileRepositoryWrite.save(profile);
      await this.eventDispatcher.dispatch(profile);
    }
    return;
  }
}
