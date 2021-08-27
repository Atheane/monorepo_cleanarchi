import { Mapper } from '@oney/common-core';
import { BankAccount } from '@oney/payment-core';
import { SmoneyCreateUserRequest } from '../partners/smoney/models/user/SmoneyCreateUserRequest';
import { SmoneyUserResponse } from '../partners/smoney/models/user/SmoneyUserResponse';

type CreateUserResponseIntersection = {
  raw: SmoneyUserResponse;
  bic: string;
};

export class SmoneyCreateBankAccountMapper implements Mapper<BankAccount> {
  fromDomain(t): SmoneyCreateUserRequest {
    return {
      AppUserId: t.uid,
      CountryCode: 'FR',
      Profile: {
        Address: {
          City: t.informations.address.city,
          Country: t.informations.address.country,
          Street: t.informations.address.additionalStreet
            ? `${t.informations.address.street} ${t.informations.address.additionalStreet}`
            : t.informations.address.street,
          ZipCode: t.informations.address.zipCode,
        },
        Alias: `${[t.informations.firstName.trim(), t.informations.birthName.trim()]
          .map(n => n[0])
          .join('.')}#${t.uid}`,
        BirthCity: t.informations.birthCity,
        BirthCountry: t.informations.birthCountry,
        BirthZipCode: t.informations.birthDepartmentCode,
        Birthdate: new Date(t.informations.birthDate).toISOString(),
        Civility: t.informations.honorificCode === '2' ? '1' : '0',
        Email: t.email,
        FirstName: t.informations.firstName,
        LastName: t.informations.legalName || t.informations.birthName,
        BirthName: t.informations.birthName,
        Phonenumber: t.informations.phone,
      },
    };
  }

  toDomain(intersection: CreateUserResponseIntersection): BankAccount {
    const { raw, bic } = intersection;
    return new BankAccount({
      uid: raw.AppUserId,
      debts: [],
      bankAccountId: raw.Id.toString(),
      iban: raw.SubAccounts[0].Iban,
      bic,
      cards: [],
      beneficiaries: [],
    });
  }
}
