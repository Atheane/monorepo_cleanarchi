import { AggregateRoot, Handle } from '@oney/ddd';
import { PreferencesUpdated, RecipientRegistered } from '@oney/notification-messages';
import { Address } from '../valuesObjects/Address';
import { Preferences, PreferencesProperties } from '../valuesObjects/Preferences';
import { Profile } from '../valuesObjects/Profile';

export interface RecipientProperties {
  uid: string;
  profile: Profile;
  preferences: Preferences;
}

export class Recipient extends AggregateRoot<RecipientProperties> {
  props: RecipientProperties;

  private constructor(props: RecipientProperties) {
    super(props.uid);
    this.props = props;
  }

  static create(props: RecipientProperties): Recipient {
    const instance = new Recipient(props);
    instance.applyChange(
      new RecipientRegistered({
        uid: props.uid,
        preferences: props.preferences,
        profile: props.profile,
      }),
    );
    return instance;
  }

  @Handle(RecipientRegistered)
  applyCreate({ props }: RecipientRegistered): void {
    const address = Address.create(props.profile.address);
    const { birthCountry, birthDate, email, lastName, phone, firstName } = props.profile;
    this.props = {
      preferences: Preferences.create(props.preferences),
      profile: Profile.create({
        birthCountry,
        birthDate,
        firstName,
        phone,
        lastName,
        email,
        address,
      }),
      uid: props.uid,
    };
  }

  @Handle(PreferencesUpdated)
  applyUpdatePreferences({ props: preferences }: PreferencesUpdated): void {
    this.props.preferences = Preferences.create({
      allowAccountNotifications: preferences.allowAccountNotifications,
      allowTransactionNotifications: preferences.allowTransactionNotifications,
    });
  }

  updatePreferences(preferences: PreferencesProperties): void {
    const { allowAccountNotifications, allowTransactionNotifications } = preferences;
    this.applyChange(
      new PreferencesUpdated({
        allowAccountNotifications,
        allowTransactionNotifications,
        uid: this.props.uid,
      }),
    );
  }
}
