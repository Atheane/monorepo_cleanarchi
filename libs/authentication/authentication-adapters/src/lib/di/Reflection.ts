import { Channel } from '@oney/authentication-core';
import { channels } from '../adapters/decorators/channels';
import { verifiers, VerifierServiceName } from '../adapters/decorators/verifiers';

export class Reflection {
  static getChannelClassInstance(channel: Channel) {
    return channels.get(channel);
  }

  static getVerifierClassInstance(verifierServiceName: VerifierServiceName) {
    return verifiers.get(verifierServiceName);
  }
}
