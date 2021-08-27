export interface SmoneyUpdateUserRequest {
  AppUserId?: string;
  CountryCode?: string;
  Profile: {
    Civility?: string;
    FirstName?: string;
    LastName?: string;
    Birthdate?: string;
    BirthCity?: string;
    BirthCountry?: string;
    Phonenumber?: string;
    Email?: string;
    Alias?: string; // firstname + lastname + #userId
    Address?: {
      Street?: string;
      ZipCode?: string;
      City?: string;
      Country?: string;
    };
  };
}
