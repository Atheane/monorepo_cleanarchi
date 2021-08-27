import { Env, KeyVault, Load, Local } from '@oney/env'; // We ignore this test case because we dont want to test app in Production mode.

/* istanbul ignore next */ const useLocalEnvironment = process.env.NODE_ENV?.includes('production');

@KeyVault(useLocalEnvironment)
export class FirebaseBasicAuthConfig {
  @Env('FirebaseBasicAuthUsername')
  username: string;

  @Env('FirebaseBasicAuthPassword')
  password: string;
}

@Local()
export class EnvConfig {
  @Env('FIREBASE_BASE_URL')
  firebaseBaseUrl: string;

  @Load(FirebaseBasicAuthConfig)
  firebaseBasicAuthConfig: FirebaseBasicAuthConfig;
}

export const envConfiguration = new EnvConfig();
