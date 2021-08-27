import { injectable } from 'inversify';
import { AxiosError } from 'axios';
import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { BankConnectionProperties, IAppConfiguration } from '@oney/aggregation-core';

@injectable()
export class PP2ReveConnectionService {
  private readonly connection: IHttpBuilder;
  constructor(private readonly appConfiguration: IAppConfiguration) {
    const httpService = new AxiosHttpMethod();
    this.connection = httpBuilder<AxiosHttpMethod>(httpService);
  }

  /* istanbul ignore next */
  setUp(urlCallBack: string): void {
    this.connection
      .setBaseUrl(urlCallBack)
      .setDefaultHeaders({ 'X-Oney-Partner-Country-Code': 'FR' })
      .configureRetry({
        retryDelay: this.appConfiguration.pp2reveConfiguration.retryDelay,
        useExponentialRetryDelay: true,
        retryCondition: (error: AxiosError) => {
          if (error.config['retryCount'] === this.appConfiguration.pp2reveConfiguration.maxRetries) {
            console.log('----- ERROR request, end retry.');
            return false;
          }
          // Do not retry when To Many Request
          if ([403, 429].includes(error.response.status)) {
            console.log(
              '----- ERROR request, stop retry.',
              error?.response?.data?.cause?.apiErrorReason?.ErrorMessage || error.message,
            );
            return false;
          }
          console.log(
            '----- ERROR request, new retry.',
            error?.response?.data?.cause?.apiErrorReason?.ErrorMessage || error.message,
          );
          return true;
        },
      })
      .setMaxRetries(this.appConfiguration.pp2reveConfiguration.maxRetries)
      .circuitDuration(400);
  }

  async postScaResult(bankConnectionProperties: BankConnectionProperties): Promise<void> {
    await this.connection.post<object>('/', bankConnectionProperties).execute();
  }
}
