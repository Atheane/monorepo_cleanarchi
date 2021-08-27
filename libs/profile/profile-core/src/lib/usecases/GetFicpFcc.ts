import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { FicpGateway } from '@oney/profile-core';
import { FicpFccCalculated, FicpFccCalculatedProps } from '@oney/profile-messages';
import { EventDispatcher } from '@oney/messages-core';
import * as httpStatus from 'http-status';
import { ProfileRepositoryRead } from '../domain/repositories/read/ProfileRepositoryRead';
import { Identifiers } from '../Identifiers';
import { FccGateway } from '../domain/gateways/FccGateway';
import { Profile } from '../domain/aggregates/Profile';
import { Ficp } from '../domain/types/Ficp';
import { FicpRequestId } from '../domain/types/FicpRequestId';
import { FccResquestId } from '../domain/types/FccResquestId';

export type GetFicpFccCommand = { uid: string };

@injectable()
export class GetFicpFcc implements Usecase<GetFicpFccCommand, void> {
  constructor(
    @inject(Identifiers.profileRepositoryRead)
    private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.ficpGateway)
    private readonly _ficpGateway: FicpGateway,
    @inject(Identifiers.fccGateway)
    private readonly _fccGateway: FccGateway,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute({ uid }: GetFicpFccCommand): Promise<void> {
    const profile = await this._profileRepositoryRead.getUserById(uid);

    const ficpRequestId = await this._ficpGateway.getRequestId(profile);
    if (ficpRequestId.status === httpStatus.OK) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.callFicpGetFlag(profile, ficpRequestId);
      return;
    }
    await this.callFcc(profile, { status: ficpRequestId.status, result: false });
  }

  async callFcc(profile: Profile, resultFicp: Ficp) {
    if (profile.props.situation.lead) {
      const fccRequestId = await this._fccGateway.getRequestId(profile);
      if (fccRequestId.status === httpStatus.OK) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.callFccGetFlag(profile, fccRequestId, resultFicp);
      } else {
        await this.dispathEvent({
          uid: profile.props.uid,
          statusCode: fccRequestId.status,
          creditIncident: resultFicp.result,
          paymentIncident: true,
        });
      }
      return;
    }
    await this.dispathEvent({
      uid: profile.props.uid,
      statusCode: resultFicp.status,
      creditIncident: resultFicp.result,
    });
  }

  async callFicpGetFlag(profile: Profile, ficpRequestId: FicpRequestId) {
    const resultFicp = await this._ficpGateway.getFlag(ficpRequestId.result);
    if (resultFicp.status === httpStatus.OK) {
      if (!resultFicp.result) {
        await this.callFcc(profile, resultFicp);
      } else {
        await this.dispathEvent({
          uid: profile.props.uid,
          statusCode: resultFicp.status,
          creditIncident: resultFicp.result,
        });
      }
      return;
    }
    await this.callFcc(profile, { status: resultFicp.status, result: false });
  }

  async callFccGetFlag(profile: Profile, fccRequestId: FccResquestId, resultFicp: Ficp) {
    const resultFcc = await this._fccGateway.getFlag(fccRequestId.result);
    if (resultFcc.status === httpStatus.OK) {
      await this.dispathEvent({
        uid: profile.props.uid,
        statusCode: resultFcc.status,
        creditIncident: resultFicp.result,
        paymentIncident: resultFcc.result,
      });
      return;
    }
    await this.dispathEvent({
      uid: profile.props.uid,
      statusCode: resultFcc.status,
      creditIncident: resultFicp.result,
      paymentIncident: true,
    });
  }

  async dispathEvent(ficpFccCalculatedProps: FicpFccCalculatedProps) {
    const domainErrorEvent = new FicpFccCalculated(ficpFccCalculatedProps);
    await this.eventDispatcher.dispatch(domainErrorEvent);
  }

  async canExecute(identity: Identity, request: GetFicpFccCommand): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }
    return identity.uid === request.uid && scope.permissions.read === Authorization.self;
  }
}
