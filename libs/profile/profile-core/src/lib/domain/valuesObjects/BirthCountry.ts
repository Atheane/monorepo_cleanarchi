import { ProfileErrors } from '../models/ProfileError';
import { UnauthorizedBirthCountries } from '../types/UnauthorizedBirthCountries';

export class BirthCountry {
  private readonly _isoCode: string;

  constructor(birthCountry: string) {
    this.validate(birthCountry);
    this._isoCode = birthCountry;
  }

  private validate(birthCountry: string): string {
    if (UnauthorizedBirthCountries.includes(birthCountry)) {
      throw new ProfileErrors.UnauthorizedBirthCountry('Birth Country is not authorized');
    }
    return birthCountry;
  }

  get value() {
    return this._isoCode;
  }
}
