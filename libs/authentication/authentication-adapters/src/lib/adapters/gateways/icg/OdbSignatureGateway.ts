import { SignatureGateway } from '@oney/authentication-core';
import { injectable } from 'inversify';
import { createSign } from 'crypto';

@injectable()
export class OdbSignatureGateway implements SignatureGateway {
  constructor(
    private readonly odbCertificateConfig: {
      signSelfCertificate: string;
      signSelfPassPhrase: string;
    },
  ) {}

  async sign(value: string): Promise<string> {
    const signatureAlgorithm = 'RSA-SHA1';
    const signatureOutput = 'base64';

    const buff = Buffer.from(this.odbCertificateConfig.signSelfCertificate, 'base64');
    const odbSignCertUtf8 = buff.toString('utf-8');
    const certificate = {
      key: odbSignCertUtf8,
      passphrase: this.odbCertificateConfig.signSelfPassPhrase,
    };

    const signer = createSign(signatureAlgorithm);
    signer.update(value);
    signer.end();

    const signature64 = signer.sign(certificate, signatureOutput);

    return signature64;
  }
}
