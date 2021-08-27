import { Profile } from '../aggregates/Profile';
import { Fcc } from '../types/Fcc';
import { FccResquestId } from '../types/FccResquestId';

export interface FccGateway {
  getRequestId(request: Profile): Promise<FccResquestId>;
  getFlag(request: number): Promise<Fcc>;
}
