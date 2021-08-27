import { HonorificCode, ProfileStatus } from '@oney/profile-messages';

export function createProfile(uid: string, honorific_code: HonorificCode, status: ProfileStatus) {
  return {
    uid,
    email: 'email',
    biometric_key: 'biometric_key',
    is_validated: true,
    profile: {
      address: {
        street: 'street',
        country: 'country',
        city: 'city',
        zip_code: 'zip_code',
      },
      phone: '0123456789',
      birth_city: 'birth_city',
      birth_country: 'birth_country',
      birth_date: '1977-11-30T23:00:00.000Z',
      birth_name: 'birth_name',
      first_name: 'first_name',
      honorific_code,
      earnings_amount: 19999,
      fiscal_country: 'fiscal_country',
      legal_name: 'legal_name',
      status,
    },
    steps: [],
    contract_signed_at: '2021-03-29T01:55:14.071Z',
  };
}
