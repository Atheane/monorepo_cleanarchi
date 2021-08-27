import { injectable } from 'inversify';
import ShortUniqueId from 'short-unique-id';
import { IdGenerator } from '@oney/profile-core';

interface Options {
  dictionary: string[];
  shuffle: boolean;
  debug: boolean;
  length: number;
}

@injectable()
export class ShortIdGenerator implements IdGenerator {
  private instance;

  constructor() {
    this.instance = new ShortUniqueId(this.getOptions());
  }

  private getOptions(): Options {
    const alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const otherCharacters: string[] = '_-'.split('');

    return {
      dictionary: [...alphabet, ...alphabet.map((item: string) => item.toUpperCase()), ...otherCharacters],
      shuffle: false,
      debug: false,
      length: 9,
    };
  }

  // istanbul ignore next : mocked value in order to be able to use nock back fixtures
  generateUniqueID(): string {
    return this.instance();
  }
}
