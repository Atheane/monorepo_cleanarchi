import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface Interceptor {
  response(response: AxiosResponse): AxiosResponse;
  error(error: AxiosError): AxiosError;
  config(config: AxiosRequestConfig): AxiosRequestConfig;
}

export interface Ok<T> {
  status: number;
  data: T;
  config: any;
}

export interface Err {
  message: any;
  config: any;
  data: any;
  response: any;
}

export type Result<T> = Ok<T>;

// eslint-disable-next-line no-irregular-whitespace
export type CommandType = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export interface RequestType {
  path: string;
  config: any;
  commandType: CommandType;
  data: any;
  params: any;
  headers: object;
}

// eslint-disable-next-line no-irregular-whitespace
export type Mode = 'OPEN' | 'HALF_OPEN' | 'CLOSED';

export interface IConfigureRetry {
  retryCondition?: (error: any) => boolean;
  shouldResetTimeOut?: boolean;
  // https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff
  useExponentialRetryDelay?: boolean;
  retryDelay?: number;
}
