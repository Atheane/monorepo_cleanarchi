import { OneKey } from '@oney/common-core';
import { Card } from '../../entities/Card';

export interface CardRepositoryRead {
  findByAccountAndCardId(accountId: string, cardId: string): Promise<Card>;
  getAll(predicate?: OneKey<keyof Card>): Promise<Card[]>;
}
