import { AuthorizedAge } from '../types/AuthorizedAge';
import { ProfileErrorCodes, ProfileErrors } from '../models/ProfileError';

export class BirthDate extends Date {
  constructor(birthDate: Date) {
    super(birthDate);
    this.validate(birthDate);
  }

  validate(birthDate: Date): void {
    const currentDate = new Date();
    birthDate = new Date(birthDate);
    const birthDateMin = new Date(
      birthDate.getFullYear() + AuthorizedAge.MIN_AGE,
      birthDate.getMonth() - 1,
      birthDate.getDay(),
    );
    const birthDateMax = new Date(
      birthDate.getFullYear() + AuthorizedAge.MAX_AGE,
      birthDate.getMonth() - 1,
      birthDate.getDay(),
    );

    if (birthDate > currentDate) {
      throw new ProfileErrors.UnauthorizedAge(
        'Birth Date cannot be in the future',
        ProfileErrorCodes.BIRTHDATE_IN_FUTURE,
      );
    }

    if (birthDateMin >= currentDate) {
      throw new ProfileErrors.UnauthorizedAge(
        'User must be more than 18',
        ProfileErrorCodes.LESS_THAN_MIN_AGE,
      );
    }

    if (birthDateMax <= currentDate) {
      throw new ProfileErrors.UnauthorizedAge(
        'User must be less than 100',
        ProfileErrorCodes.MORE_THAN_MAX_AGE,
      );
    }

    return;
  }
}
