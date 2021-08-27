import { Card } from '../../types/Card';

export interface CardGateway {
  decrypt(ciphertext: string): Promise<Card>;
}
