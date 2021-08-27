import { inject, injectable, interfaces } from 'inversify';
import { IdentityIdentifier } from '../IdentityIdentifier';
import { Identity } from '../domain/entities/Identity';
import { AutorisationGateway } from '../domain/gateways/AutorisationGateway';
import { ProviderGateway } from '../domain/gateways/ProviderGateway';
import { Usecase } from '../domain/models/Usecase';
import { IdentityService } from '../domain/services/IdentityService';

//! TODO Find a way to replace the decodeIdentity by this,
/*
* export class IdentityHolder extends EntityHolder<Identity> {
  constructor(holder: string, identityDecoder: IdentityDecoder) {
    super(holder, identityDecoder);
  }

  getIdentity(): Identity {
    return this.getEntity();
  }
}

export interface IdentityDecoder extends EntityDecoder<Identity> {
  decode(holder: string): Identity;
}

export class EntityHolder<T> {
  constructor(
    private holder: string,
    private entityDecoder: EntityDecoder<T>
  ) {}

  getEntity(): T {
    return this.entityDecoder.decode(this.holder);
  }

  getHolder(): string {
    return this.holder;
  }
}


export interface EntityDecoder<T> {
  decode(holder: string): T;
}

*
* */

export interface DecodeIdentityCommand {
  holder: string;
  scaHolder?: string;
  ipAddress?: string;
}

@injectable()
export class DecodeIdentity implements Usecase<DecodeIdentityCommand, Identity> {
  constructor(
    @inject(IdentityIdentifier.providerGateway) private readonly _providerGateway: ProviderGateway,
    @inject('Factory<IdentityService>')
    private readonly _identityService: interfaces.Factory<IdentityService>,
    @inject(IdentityIdentifier.authorizationGateway)
    private readonly _authorizationGateway: AutorisationGateway,
  ) {}

  async execute(request: DecodeIdentityCommand): Promise<Identity> {
    const identityProvider = await this._providerGateway.find(request.holder);
    // We route to the good implementation here thanks to identityProvider.
    const identityService = this._identityService(identityProvider) as IdentityService;
    const identity = await identityService.handle(request.holder);
    return {
      ...identity,
      ...(request.scaHolder && {
        scaHolder: request.scaHolder,
      }),
      ...(request.ipAddress && {
        ipAddress: request.ipAddress,
      }),
    };
  }

  async canExecute(identity: Identity): Promise<boolean> {
    return this._authorizationGateway.isAuthorized(identity);
  }
}
