import { Card } from '../../entities/Card';

export interface CardRepositoryWrite {
  update(card: Card): Promise<Card>;
  create(card: Card): Promise<Card>;
}
