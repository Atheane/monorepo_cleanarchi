export interface PreferencesProperties {
  allowAccountNotifications: boolean;
  allowTransactionNotifications: boolean;
}

export class Preferences {
  private _allowAccountNotifications: boolean;
  private _allowTransactionNotifications: boolean;

  private constructor(preferencesProperties: PreferencesProperties) {
    this._allowAccountNotifications = preferencesProperties.allowAccountNotifications;
    this._allowTransactionNotifications = preferencesProperties.allowTransactionNotifications;
  }

  static create(preferencesProperties: PreferencesProperties): Preferences {
    return new Preferences(preferencesProperties);
  }

  public get allowTransactionNotifications(): boolean {
    return this._allowTransactionNotifications;
  }

  public get allowAccountNotifications(): boolean {
    return this._allowAccountNotifications;
  }
}
