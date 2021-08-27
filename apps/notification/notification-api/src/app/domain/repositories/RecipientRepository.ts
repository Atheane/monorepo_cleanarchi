import { Recipient } from '../entities/Recipient';

export interface RecipientRepository {
  findBy(uid: string): Promise<Recipient>;
  save(recipient: Recipient): Promise<Recipient>;
}
