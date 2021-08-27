import { Bank } from '../entities/Bank';

export interface BankRepository {
  getAll(): Promise<Bank[]>;
  getById(id: string): Promise<Bank>;
}
