import { IdGenerator } from '@oney/payment-core';
import { injectable } from 'inversify';
import ShortUniqueId from 'short-unique-id';

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

  generateUniqueID(): string {
    return this.instance.randomUUID();
  }
}
