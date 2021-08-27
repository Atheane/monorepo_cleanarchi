import { HashType } from '../../types/HashType';

export interface HashGateway {
  hash(value: string, algorythm: HashType): Promise<string>;
  compareHash(value: string, hash: string): Promise<boolean>;
}
