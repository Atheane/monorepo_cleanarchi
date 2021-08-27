import { AxiosError } from 'axios';
import { Observable } from 'rxjs';

export type RetryStrategyFactoryOptions = {
  strategyType?: unknown;
  retryLimit?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
  defaultError?: {
    domainErrorText: string;
    DomainErrorConstructor: any;
  };
  statusToErrorMap?: Map<
    number,
    {
      domainErrorText: string;
      DomainErrorConstructor: any;
    }
  >;
  userId?: string;
};

export type RetryConfig = Omit<RetryStrategyFactoryOptions, 'strategyType'>;

export interface RetryStrategyOperatorFactory {
  (retryUtils?: object, { retryLimit, scalingDuration, excludedStatusCodes }?: RetryConfig): (
    attempts: Observable<AxiosError>,
  ) => Observable<number>;
}

export interface RetryStrategyGenerator {
  generateStrategy(options?: RetryStrategyFactoryOptions): RetryStrategyOperatorFactory;
}
