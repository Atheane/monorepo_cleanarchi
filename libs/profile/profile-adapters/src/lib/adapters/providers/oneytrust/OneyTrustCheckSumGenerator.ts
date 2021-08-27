import { createHmac } from 'crypto';

export class OneyTrustCheckSumGenerator {
  constructor(private readonly _secretKey: string) {}

  generate(payload): string {
    const hmac = createHmac('sha512', this._secretKey);
    const signed = hmac.update(JSON.stringify(payload)).digest('hex');
    hmac.destroy();
    return signed;
  }

  generateTulipeChecksum(payload: Record<string, string | number>): string {
    let message = '';
    // eslint-disable-next-line guard-for-in
    for (const prop in payload) {
      message += `${prop}=${payload[prop]}&`;
    }
    message = message.substring(0, message.length - 1);
    const hmac = createHmac('sha512', this._secretKey);
    const signed = hmac.update(Buffer.from(message, 'utf-8')).digest('hex');
    return signed;
  }

  generateFileUploadChecksum(payload: any): string {
    const hmac = createHmac('sha512', this._secretKey);
    hmac.update(`entityReference=${payload.entityReference}&`);
    hmac.update(`caseReference=${payload.caseReference}&`);
    hmac.update('content=');
    hmac.update(payload.content);
    hmac.update(`&name=${payload.name}&`);
    hmac.update(`elementType=${payload.elementType}`);

    return hmac.digest('hex');
  }

  generateFileDeleteChecksum({ entityReference, caseReference }): string {
    const hmac = createHmac('sha512', this._secretKey);
    hmac.update(`entityReference=${entityReference}&`);
    hmac.update(`caseReference=${caseReference}`);

    return hmac.digest('hex');
  }
}
