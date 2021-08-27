import { InvitationMapper } from '@oney/authentication-adapters';
import { AuthIdentifier } from '@oney/authentication-core';
import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { InvitationTokenPayload } from '../../configuration/reqContext/Invitation';

@injectable()
export class InvitationMiddleware implements ExpressMiddlewareInterface {
  constructor(
    @inject(AuthIdentifier.mappers.invitation) private readonly _invitationMapper: InvitationMapper,
  ) {}

  async use(req: InvitationTokenPayload, res: Response, next: Function) {
    try {
      const invitationToken = req.headers.invitation_token as string;
      if (!invitationToken) {
        return res.sendStatus(401);
      }
      req.invitation = this._invitationMapper.toDomain(invitationToken);
      return next();
    } catch (e) {
      return res.sendStatus(400);
    }
  }
}
