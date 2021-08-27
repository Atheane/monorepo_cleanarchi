import { Invitation, InvitationRepository } from '@oney/authentication-core';
import { injectable } from 'inversify';
import { Model } from 'mongoose';
import { InvitationDoc, InvitationModel } from '../models/invitation.schema';
// Case cover in Authentication-api
/* istanbul ignore next */
@injectable()
export class MongodbInvitationRepository implements InvitationRepository {
  private invitationModel: Model<InvitationDoc>;

  constructor() {
    this.invitationModel = InvitationModel;
  }

  async save(invitation: Invitation): Promise<Invitation> {
    const result = await this.invitationModel
      .findOneAndUpdate(
        {
          uid: invitation.uid,
        },
        { ...invitation, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return new Invitation(result);
  }

  async findById(identifier: string): Promise<Invitation> {
    const result = await this.invitationModel
      .findOne({
        uid: identifier,
      })
      .select('-_id')
      .lean();
    if (!result) {
      return null;
    }
    return new Invitation(result);
  }

  async findByEmail(email: string): Promise<Invitation> {
    const result = await this.invitationModel
      .findOne({
        email: email,
      })
      .select('-_id')
      .lean();
    if (!result) {
      return null;
    }
    return new Invitation(result);
  }

  async findByPhone(phone: string): Promise<Invitation> {
    const result = await this.invitationModel
      .findOne({
        phone: phone,
      })
      .select('-_id')
      .lean();
    if (!result) {
      return null;
    }
    return new Invitation(result);
  }
}
