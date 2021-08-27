import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { P2pRepository } from '../../domain/repositories/P2pRepository';
import { P2p } from '../../domain/entities/P2p';
import { IdGenerator } from '../../domain/gateways/idGenerator';
import { P2pProperties } from '../../domain/valueobjects/p2p/P2pProperties';

export interface CreateP2pCommand {
  p2pCreated: P2pProperties;
}

@injectable()
export class CreateP2p implements Usecase<CreateP2pCommand, Promise<P2p>> {
  constructor(
    @inject(PfmIdentifiers.p2pRepository) private readonly p2pRepository: P2pRepository,
    @inject(PfmIdentifiers.idGenerator) private readonly idGenerator: IdGenerator,
  ) {}

  async execute(request: CreateP2pCommand): Promise<P2p> {
    const { p2pCreated } = request;

    return this.p2pRepository.create(
      new P2p({
        id: this.idGenerator.generateUniqueID(),
        ...p2pCreated,
      }),
    );
  }
}
