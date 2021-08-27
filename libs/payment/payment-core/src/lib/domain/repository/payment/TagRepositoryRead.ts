import { Tag } from '../../valueobjects/Tag';

export interface TagRepositoryRead {
  getByRef(ref: number, contractNumber?: string): Promise<Tag>;
}
