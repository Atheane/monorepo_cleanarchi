import { HashGateway, HashType, UserError } from '@oney/authentication-core';
import * as crypto from 'crypto-js';
import { injectable } from 'inversify';
import * as bcrypt from 'bcryptjs';

@injectable()
export class OdbHashGateway implements HashGateway {
  async hash(value: string, algorythm: HashType): Promise<string> {
    switch (algorythm) {
      case HashType.MD5:
        return crypto.MD5(value).toString();
      case HashType.BCRYPT:
        return await bcrypt.hash(value, 12);
    }
  }

  async compareHash(value: string, hash: string): Promise<boolean> {
    const comparedPassword = await bcrypt.compare(value, hash);
    if (!comparedPassword) {
      throw new UserError.PasswordNotValid('PASSWORD_DOES_NOT_MATCH');
    }
    return comparedPassword;
  }
}
