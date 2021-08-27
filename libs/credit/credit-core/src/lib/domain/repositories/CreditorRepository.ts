import { Creditor, CreditorProperties } from '../entities';

export interface CreditorRepository {
  findBy(userId: string): Promise<Creditor>;
  create(creditorProperties: CreditorProperties): Promise<Creditor>;
  save(creditorProperties: CreditorProperties): Promise<Creditor>;
}
