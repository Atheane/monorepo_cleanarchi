import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { MaybeType } from '@oney/common-core';
import { Invitation } from '../../domain/entities/Invitation';
import { IdGenerator } from '../../domain/gateways/IdGenerator';
import { InvitationGateway } from '../../domain/gateways/InvitationGateway';
import { RegisterValidateError } from '../../domain/models/AuthenticationError';
import { InvitationRepository } from '../../domain/repositories/InvitationRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { InvitationState } from '../../domain/types/InvitationState';
import { AuthIdentifier } from '../AuthIdentifier';
import { Channel } from '../..';
import { DefaultDomainErrorMessages } from '../../domain/models/AuthenticationErrorMessage';

export interface RegisterValidateCommand {
  invitationId: string;
}

@injectable()
export class RegisterValidate implements Usecase<RegisterValidateCommand, Promise<Invitation>> {
  constructor(
    @inject(AuthIdentifier.invitationGateway) private readonly invitationGateway: InvitationGateway,
    @inject(AuthIdentifier.invitationRepository) private readonly invitationRepository: InvitationRepository,
    @inject(AuthIdentifier.idGenerator) private readonly idGenerator: IdGenerator,
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(request: RegisterValidateCommand): Promise<Invitation> {
    const { invitationId } = request;

    const foundInvitation = await this.invitationRepository.findById(invitationId);
    if (!foundInvitation) {
      throw new RegisterValidateError.InvitationDoesNotExist('INVITATION_DOES_NOT_EXIST');
    }
    const maybedUser = await this.userRepository.findByEmail(foundInvitation.email);

    if (foundInvitation.isCompleted() && maybedUser.type === MaybeType.Just) {
      throw new RegisterValidateError.InvitationAlreadyCompleted(
        DefaultDomainErrorMessages.INVITATION_ALREADY_COMPLETED,
      );
    }

    const isExpired = foundInvitation.isInvitationExpired(10);
    if (isExpired) {
      await this.invitationRepository.save({ ...foundInvitation, state: InvitationState.EXPIRED });
      const newInvitation = new Invitation({
        uid: this.idGenerator.generateUniqueID(),
        email: foundInvitation.email,
        phone: foundInvitation.phone,
        channel: Channel.EMAIL,
      });
      const invitation = await this.invitationRepository.save(newInvitation);
      await this.invitationGateway.send(invitation, Channel.EMAIL);
      throw new RegisterValidateError.InvitationExpired('INVITATION_EXPIRED');
    }

    return await this.invitationRepository.save({ ...foundInvitation, state: InvitationState.COMPLETED });
  }
}
