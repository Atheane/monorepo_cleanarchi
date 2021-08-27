import { UserError } from '../models/AuthenticationError';

export class Password {
  static validate(password: string): string {
    if (!password || password.length !== 6) {
      throw new UserError.PasswordNotValid('PASSWORD_MUST_CONTAIN_SIX_CHARACTERS');
    }
    return password;
  }
}
