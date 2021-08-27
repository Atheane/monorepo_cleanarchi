import { Interceptor } from '@oney/http';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as crypto from 'crypto';

export class RequestInterceptor implements Omit<Interceptor, 'response'> {
  constructor(private readonly _key: string) {}

  /* istanbul ignore next */
  error(error: AxiosError): AxiosError {
    throw error;
  }

  config(config: AxiosRequestConfig): AxiosRequestConfig {
    const iv = Buffer.from('');
    const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(this._key, 'base64'), iv);
    const encryptedMessage =
      cipher.update(JSON.stringify(config.data.encrypted_message), 'utf8', 'base64') + cipher.final('base64');
    return {
      ...config,
      data: {
        partner_guid: config.data.partner_guid,
        encrypted_message: encryptedMessage,
      },
    };
  }
}

export class ResponseInterceptor implements Omit<Interceptor, 'config'> {
  constructor(private readonly _key: string) {}

  response(response: AxiosResponse): AxiosResponse {
    const win1252toUnicode = {
      '7B': '{',
      '22': '"',
      '3A': ':',
      '7D': '}',
    };
    const iv = Buffer.from('');
    const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(this._key, 'base64'), iv);
    let decryptedMessage =
      decipher.update(response.data.encrypted_message, 'base64', 'utf8') + decipher.final('utf8');
    /* eslint-disable-next-line no-unused-vars */
    decryptedMessage = decryptedMessage.replace(/%([0-9abcdef]{2})/gi, function (match, code) {
      return win1252toUnicode[code];
    });
    return {
      ...response,
      data: JSON.parse(decryptedMessage),
    };
  }

  /* istanbul ignore next */
  error(error: AxiosError): AxiosError {
    throw error;
  }
}
