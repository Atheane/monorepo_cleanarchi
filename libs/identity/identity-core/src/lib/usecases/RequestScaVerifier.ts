import { inject, injectable } from 'inversify';
import { IdentityIdentifier } from '../IdentityIdentifier';
import { Identity } from '../domain/entities/Identity';
import { RequestScaGateway } from '../domain/gateways/RequestScaGateway';
import { Usecase } from '../domain/models/Usecase';
import { ScaVerifier } from '../domain/types/ScaVerifier';
import { Action } from '../domain/types/ScaVerifier';

export interface RequestScaVerifierRequest {
  identity: Identity;
  action: Action;
}

@injectable()
export class RequestScaVerifier implements Usecase<RequestScaVerifierRequest, ScaVerifier> {
  constructor(
    @inject(IdentityIdentifier.requestScaGateway) private readonly _requestScaGateway: RequestScaGateway,
  ) {}

  async execute(request: RequestScaVerifierRequest): Promise<ScaVerifier> {
    return await this._requestScaGateway.requestSca(request.identity, request.action);
  }
}
