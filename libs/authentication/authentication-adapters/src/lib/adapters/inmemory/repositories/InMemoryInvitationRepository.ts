import { Invitation, InvitationRepository, InvitationState } from '@oney/authentication-core';

export class InMemoryInvitationRepository implements InvitationRepository {
  constructor(private store: Map<string, Invitation>) {}

  findById(invitationId: string): Promise<Invitation> {
    const invitation = this.store.get(invitationId);
    if (!invitation) {
      return null;
    }
    return Promise.resolve(new Invitation(invitation));
  }

  findByEmail(email: string): Promise<Invitation> {
    const invitation = this.store.get(email);
    if (!invitation) {
      return null;
    }
    return Promise.resolve(invitation);
  }

  findByPhone(phone: string): Promise<Invitation> {
    const invitation = this.store.get(phone);
    if (!invitation) {
      return null;
    }
    return Promise.resolve(invitation);
  }

  async save(invitation: Invitation): Promise<Invitation> {
    if (!invitation.createdAt) {
      // eslint-disable-next-line no-param-reassign
      invitation.createdAt = new Date();
    }
    if (!invitation.state) {
      // eslint-disable-next-line no-param-reassign
      invitation.state = InvitationState.PENDING;
    }
    // eslint-disable-next-line no-param-reassign
    invitation.updatedAt = new Date();
    this.store.set(invitation.uid, invitation);
    this.store.set(invitation.email, invitation);
    this.store.set(invitation.phone, invitation);
    return this.findById(invitation.uid);
  }
}
