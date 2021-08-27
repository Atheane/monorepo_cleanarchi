import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { MaybeType } from '@oney/common-core';
import { Invitation } from '../../domain/entities/Invitation';
import { IdGenerator } from '../../domain/gateways/IdGenerator';
import { InvitationGateway } from '../../domain/gateways/InvitationGateway';
import { RegisterCreateError, UserError } from '../../domain/models/AuthenticationError';
import { InvitationRepository } from '../../domain/repositories/InvitationRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { InvitationState } from '../../domain/types/InvitationState';
import { Email } from '../../domain/valueobjects/Email';
import { AuthIdentifier } from '../AuthIdentifier';
import { Channel } from '../..';
import { DefaultDomainErrorMessages } from '../../domain/models/AuthenticationErrorMessage';

export interface RegisterCreateCommand {
  email: string;
  phone?: string;
}

@injectable()
export class RegisterCreate implements Usecase<RegisterCreateCommand, Invitation> {
  constructor(
    @inject(AuthIdentifier.invitationGateway) private readonly invitationGateway: InvitationGateway,
    @inject(AuthIdentifier.invitationRepository) private readonly invitationRepository: InvitationRepository,
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    @inject(AuthIdentifier.idGenerator) private readonly idGenerator: IdGenerator,
  ) {}

  async execute({ email, phone }: RegisterCreateCommand): Promise<Invitation> {
    if (email && !Email.isValid(email))
      throw new UserError.InvalidEmail(DefaultDomainErrorMessages.INVALID_EMAIL_ADDRESS);
    const maybedFoundUser = await this.userRepository.findByEmail(email);
    if (maybedFoundUser.type === MaybeType.Just)
      throw new RegisterCreateError.UserAlreadyExist(DefaultDomainErrorMessages.USER_ALREADY_EXIST);
    const channel = email ? Channel.EMAIL : Channel.SMS;
    if (email && phone) {
      const hasPhoneBeenInvited = await this.invitationRepository.findByPhone(phone);
      if (!hasPhoneBeenInvited) throw new RegisterCreateError.PhoneNotVerified('PHONE_NOT_VERIFIED');
    }
    let invitation = await this.invitationRepository.findByEmail(email);
    const isInvitationExpired = invitation?.isInvitationExpired(10);
    if (invitation && isInvitationExpired) {
      await this.invitationRepository.save({ ...invitation, state: InvitationState.EXPIRED });
    }
    if (!invitation || isInvitationExpired) {
      const iProps = { uid: this.idGenerator.generateUniqueID(), email, phone, channel };
      invitation = new Invitation(iProps);
      invitation = await this.invitationRepository.save(invitation);
    }
    await this.invitationGateway.send(invitation, channel);
    return invitation;
  }
}
