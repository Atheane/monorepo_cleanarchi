import { Invitation } from '../entities/Invitation';

export interface InvitationRepository {
  save(invitation: Invitation): Promise<Invitation>;
  findById(identifier: string): Promise<Invitation>;
  findByEmail(email: string): Promise<Invitation>;
  findByPhone(phone: string): Promise<Invitation>;
}
