import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { IAppConfiguration } from '../../di/app';
import { OdbPaymentResponse, OdbPaymentCommand } from '../models';

@injectable()
export class OdbConnectionService {
  constructor(
    @inject(Identifiers.appConfiguration)
    private config: IAppConfiguration,
  ) {}

  async executePayment(body: OdbPaymentCommand): Promise<OdbPaymentResponse> {
    const connection = httpBuilder<AxiosHttpMethod>(new AxiosHttpMethod())
      .setBaseUrl(this.config.odbPaymentBaseUrl)
      .configureRetry({
        retryDelay: this.config.odbPaymentRetryDelay,
        useExponentialRetryDelay: true,
        retryCondition: (error: AxiosError) => {
          if (error.config['retryCount'] === this.config.odbPaymentMaxRetries) {
            console.log('----- ERROR request, end retry.');
            return false;
          }
          // Do not retry when To Many Request
          if ([403, 429].includes(error.response.status)) {
            /* istanbul ignore next */
            console.log(
              '----- ERROR request, stop retry.',
              error?.response?.data?.cause?.apiErrorReason?.ErrorMessage || error.message,
            );
            return false;
          }
          /* istanbul ignore next */
          console.log(
            '----- ERROR request, new retry.',
            error?.response?.data?.cause?.apiErrorReason?.ErrorMessage || error.message,
          );
          return true;
        },
      })
      .setMaxRetries(this.config.odbPaymentMaxRetries)
      .circuitDuration(400)
      .setDefaultHeaders({ Authorization: `Basic ${this.config.odbPaymentAuthKey}` });

    const result = await connection.post<OdbPaymentResponse>('/p2p', body).execute();
    return result.data;
  }
}
