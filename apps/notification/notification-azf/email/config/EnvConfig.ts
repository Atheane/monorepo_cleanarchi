import { Env, Local } from '@oney/env';

@Local()
export class EnvConfig {
  @Env('FROM_EMAIL_ADDRESS')
  fromEmailAddress: string;
}

export const envConfiguration = new EnvConfig();
