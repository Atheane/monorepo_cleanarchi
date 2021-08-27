import {
  AddressStepValidated,
  CivilStatusValidated,
  ContractSigned,
  FiscalStatusValidated,
  PhoneStepValidated,
  ProfileCreated,
} from '@oney/profile-messages';

export const domainEventsToLegacyEvents = [
  PhoneStepValidated.name,
  AddressStepValidated.name,
  CivilStatusValidated.name,
  FiscalStatusValidated.name,
  ContractSigned.name,
  ProfileCreated.name,
];
