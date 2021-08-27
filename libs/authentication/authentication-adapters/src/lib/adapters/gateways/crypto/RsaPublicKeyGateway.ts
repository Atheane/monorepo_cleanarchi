import { PublicKeyGateway, RsaPublicKey } from '@oney/authentication-core';
import { DomainConfiguration } from '../../models/DomainConfiguration';

export class RsaPublicKeyGateway implements PublicKeyGateway {
  constructor(private readonly domainConfiguration: DomainConfiguration) {}

  public getPublicKeysFromConfig(): RsaPublicKey[] {
    const rawOneyRsaConfig = this.domainConfiguration.tokenKeys.oneyFr;
    return [JSON.parse(Buffer.from(rawOneyRsaConfig, 'base64').toString('utf-8')) as RsaPublicKey];
  }
}
