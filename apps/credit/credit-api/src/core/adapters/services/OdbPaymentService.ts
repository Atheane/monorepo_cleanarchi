import { PaymentExecution, SplitProduct } from '@oney/credit-messages';
import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import { defaultLogger } from '@oney/logger-adapters';
import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';
import { PaymentService, IAppConfiguration } from '@oney/credit-core';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { PaymentExecutionMapper } from '../mappers';
import { OdbPaymentResponse, OdbPaymentBody, P2PReferences } from '../models';

@injectable()
export class OdbPaymentService implements PaymentService {
  private readonly config: IAppConfiguration;
  private readonly decodedCredential: string;

  constructor(
    @inject(Symbol.for('paymentExecutionMapper'))
    private readonly paymentExecutionMapper: PaymentExecutionMapper,
  ) {
    this.config = getAppConfiguration();
  }

  async executePayment(
    paymentExecution: PaymentExecution,
    userId: string,
    contractNumber: string,
    productCode: SplitProduct,
  ): Promise<PaymentExecution | void> {
    const ax = new AxiosHttpMethod();
    const connection = httpBuilder<AxiosHttpMethod>(ax)
      .setBaseUrl(this.config.odbPaymentConfiguration.baseUrl)
      .configureRetry({
        retryDelay: this.config.odbPaymentConfiguration.retryDelay,
        useExponentialRetryDelay: true,
        retryCondition: (error: AxiosError) => {
          if (error.config['retryCount'] === this.config.odbPaymentConfiguration.maxRetries) {
            /* istanbul ignore next */
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
      .setMaxRetries(this.config.odbPaymentConfiguration.maxRetries)
      .circuitDuration(400)
      .setDefaultHeaders({ Authorization: `Basic ${this.config.odbPaymentConfiguration.authKey}` });
    const matchingKey = `${productCode} ${paymentExecution.key}`;
    const refP2P = P2PReferences.find(p2p => p2p.key === matchingKey);

    const payload: OdbPaymentBody = {
      ref: refP2P.ref,
      amount: paymentExecution.amount,
      message: refP2P.label,
      senderId: userId,
      contractNumber,
    };

    try {
      const { data: result } = await connection.post<OdbPaymentResponse>('/p2p', payload).execute();
      defaultLogger.info(
        `----- SUCCESS for userId:${userId}, ref:${matchingKey}, amount:${paymentExecution.amount} orderId:${result.orderId}`,
      );
      return this.paymentExecutionMapper.toDomain({ result, paymentExecution });
    } catch (e) {
      /* istanbul ignore next */
      defaultLogger.error(
        `----- ERROR for userId:${userId}, ref:${matchingKey}, amount:${paymentExecution.amount}.`,
        e?.response?.data,
      );
    }
    return Promise.resolve();
  }
}
