import { P2p } from '../entities/P2p';

export interface P2pRepository {
  create(payment: P2p): Promise<P2p>;
  getAll(accountIds: string[], options?: { dateFrom: number; dateTo: number }): Promise<P2p[]>;
  getById(p2pId: string): Promise<P2p>;
}
