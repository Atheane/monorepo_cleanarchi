import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers, KycRepositoryWrite, ProfileRepositoryRead } from '@oney/profile-core';
import { v4 as uuidv4 } from 'uuid';
import { OtScoringReceived } from '@oney/profile-messages';
import { EventDispatcher } from '@oney/messages-core';
import { OtCallbackCommand } from '../commands/OtCallbackCommand';

@injectable()
export class ProcessScoringCallback implements Usecase<OtCallbackCommand, void> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.kycRepository) private readonly kycRepositoryWrite: KycRepositoryWrite,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(command: OtCallbackCommand): Promise<void> {
    await this.kycRepositoryWrite.save(uuidv4(), {
      date: new Date(),
      data: command,
    });

    const profile = await this.profileRepositoryRead.getProfileByCaseReference(command.caseReference);

    const event = new OtScoringReceived({
      uid: profile.props.uid,
      caseReference: command.caseReference,
      caseId: command.caseId,
      decisionScore: command.caseScore as number,
      decision: command.decision,
      sanctioned: command.subResult_aml_sanctions,
      politicallyExposed: command.subResult_aml_pep,
      compliance: command.subResult_compliance,
      fraud: command.subResult_fraud,
    });
    await this.eventDispatcher.dispatch(event);
  }
}
