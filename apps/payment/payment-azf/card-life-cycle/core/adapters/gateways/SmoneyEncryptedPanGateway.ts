import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable, unmanaged } from 'inversify';
import { GenericError } from '@oney/common-core';
import { EncryptedPanGateway } from '../../domain/gateways/EncryptedPanGateway';
import { SmoneyApiProvider } from '../../odb/partners/SmoneyApiProvider';
import { CallbackPayload } from '../types/CallbackPayload';

@injectable()
export class SmoneyEncryptedPanGateway implements EncryptedPanGateway {
  constructor(
    @inject(SmoneyApiProvider) private readonly smoneyApiProvider: SmoneyApiProvider,
    @unmanaged() private readonly publicKey: string,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {}

  async getEncryptedPan(callbackPayload: CallbackPayload): Promise<string> {
    this._logger.info(
      `Starting request to get encrypted card data from SMO for reference ${callbackPayload.reference}`,
    );

    console.log(`Public key used to get card data has length: ${this.publicKey.length}`);

    const data = await this.smoneyApiProvider.api().smoneyCardApi.getEncryptedPan({
      cardId: callbackPayload.reference,
      RSAKey: this.publicKey,
    });

    if (!data.buffer) {
      const encodedBody64 = Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
      console.log(`No card data in response from partner : ${encodedBody64}`);
      throw new GenericError.ApiResponseError(`Error occured with partner on card data retrieval`);
    }

    return data.buffer.encryptedData;
  }
}
