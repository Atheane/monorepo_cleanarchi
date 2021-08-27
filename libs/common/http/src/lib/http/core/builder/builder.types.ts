import { Result, IConfigureRetry, Interceptor } from '../types';

export type IHttpBuilder = BuilderConfiguration & BuilderMethod;

export type ChainableHttp = {
  with(): BuilderMethod;
};

export type BuilderMethod = {
  get<T>(path: string, params?: any, headers?: object): ChainableHttp & HttpExecutableCommand<T>;
  post<T>(path: string, data: any, params?: any, headers?: object): ChainableHttp & HttpExecutableCommand<T>;
  patch<T>(path: string, data: any, params?: any, headers?: object): ChainableHttp & HttpExecutableCommand<T>;
  put<T>(path: string, data: any, params?: any, headers?: object): ChainableHttp & HttpExecutableCommand<T>;
  delete<T>(
    path: string,
    data?: any,
    params?: any,
    headers?: object,
  ): ChainableHttp & HttpExecutableCommand<T>;
};

export type BuilderConfiguration = {
  setDefaultHeaders<T extends object>(options: T): BuilderConfiguration & BuilderMethod;
  setAdditionnalHeaders<T extends object>(
    config: T,
    override?: boolean,
  ): BuilderConfiguration & BuilderMethod;
  setBaseUrl(url: string): BuilderConfiguration & BuilderMethod;
  setResponseTimeout(duration: number): BuilderConfiguration & BuilderMethod;
  configureRetry(options: IConfigureRetry): BuilderConfiguration & BuilderMethod;
  getConfiguration<T extends object>(): T;
  getClient<T>(): T;
  getInstance<T>(): T;
  setMaxRetries(retries: number): BuilderConfiguration & BuilderMethod;
  circuitDuration(duration: number): BuilderConfiguration & BuilderMethod;
  statusCodesForRetry(statusCodes: number[]): BuilderConfiguration & BuilderMethod;
  setRequestsConfiguration<T extends object>(config: T): BuilderConfiguration & BuilderMethod;
  setRequestInterceptor(interceptor: Omit<Interceptor, 'response'>): BuilderConfiguration & BuilderMethod;
  setResponseInterceptor(interceptor: Omit<Interceptor, 'config'>): BuilderConfiguration & BuilderMethod;
};

export type HttpExecutableCommand<T> = {
  execute(): Promise<Result<T>>;
  executeAll(): Promise<Result<T>[]>;
};
