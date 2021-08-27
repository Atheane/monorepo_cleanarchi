import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { RecipientDaoProperties } from '../../database/RecipientDaoProperties';
import { Recipient } from '../../domain/entities/Recipient';
import { Preferences } from '../../domain/valuesObjects/Preferences';
import { Address, AddressProperties } from '../../domain/valuesObjects/Address';
import { Profile } from '../../domain/valuesObjects/Profile';

@injectable()
export class RecipientMapper implements Mapper<Recipient, RecipientDaoProperties> {
  toDomain(raw: RecipientDaoProperties): Recipient {
    const addressDao = Address.create({ ...raw.profile.address });
    const profileDao = Profile.create({ ...raw.profile, address: addressDao });
    const preferencesDao = Preferences.create({ ...raw.preferences });

    const recipientToDomain = Recipient.create({
      profile: profileDao,
      uid: raw.uid,
      preferences: preferencesDao,
    });

    return recipientToDomain;
  }

  fromDomain({ props }: Recipient): RecipientDaoProperties {
    const { profile, uid, preferences } = props;
    const { birthCountry, address, email, birthDate, phone, lastName, firstName } = profile;
    const { zipCode, street, country, city, additionalStreet } = address;
    const { allowAccountNotifications, allowTransactionNotifications } = preferences;
    const addressDAO: AddressProperties = {
      city,
      country,
      zipCode,
      street,
    };
    if (additionalStreet) addressDAO.additionalStreet = additionalStreet;
    const recipientDAO: RecipientDaoProperties = {
      uid,
      profile: {
        birthCountry,
        birthDate,
        email,
        firstName,
        lastName,
        phone,
        address: addressDAO,
      },
      preferences: {
        allowAccountNotifications,
        allowTransactionNotifications,
      },
    };

    return recipientDAO;
  }
}
