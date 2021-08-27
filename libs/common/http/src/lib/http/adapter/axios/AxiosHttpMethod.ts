/* eslint-disable */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { exponentialDelay } from 'axios-retry';
import { AxiosConfiguration } from './axios.types';
import { errorFormatter } from './errorFormatter';
import { HttpMethods, Result, Mode, IConfigureRetry, Interceptor } from '../../core';

const axiosRetry = require('axios-retry');
const _ = require('lodash');

export class AxiosHttpMethod extends HttpMethods {
  private _mode: Mode;

  _http: AxiosInstance;

  _options: AxiosRequestConfig;

  protected readonly _config: AxiosConfiguration;

  constructor() {
    super();
    this._mode = 'CLOSED';
    this._http = axios.create({
      ...this._options,
      validateStatus: status => status >= 200 && status < 400,
    });
    this.requestInterceptor();
    this.responseInterceptor();
  }

  /**
   * We ensure that setting config before request will not alter or be in conflict with the request himself
   */
  private hydrateConfig(config: AxiosRequestConfig): AxiosConfiguration {
    const hydrateConfig = config;
    if (hydrateConfig) {
      delete hydrateConfig.data;
      delete hydrateConfig.headers;
      delete hydrateConfig.params;
      delete hydrateConfig.timeout;
      delete hydrateConfig.url;
      delete hydrateConfig.baseURL;
      delete hydrateConfig.method;
      delete hydrateConfig.cancelToken;
      return hydrateConfig;
    }
    return hydrateConfig;
  }

  get mode(): Mode {
    return this._mode;
  }

  set mode(mode: Mode) {
    this._mode = mode;
  }

  get client(): AxiosInstance {
    return this._http;
  }

  get instance(): this {
    return this;
  }

  get config(): AxiosRequestConfig {
    return this._http.defaults;
  }

  set setBaseUrl(url: string) {
    this._http.defaults.baseURL = url;
  }

  set setTimeout(duration: number) {
    this._http.defaults.timeout = duration;
  }

  setAdditionnalHeaders(headers: object, override?: boolean): void {
    this._options = _.merge({}, override ? {} : this._options, { headers });
  }

  setResponseInterceptor(interceptor: Omit<Interceptor, 'config'>) {
    this._http.interceptors.response.use(
      (response: AxiosResponse) => interceptor.response(response),
      (error: AxiosError) => interceptor.error(error),
    );
  }

  setRequestInterceptor(interceptor: Omit<Interceptor, 'response'>) {
    this._http.interceptors.request.use(
      (config: AxiosRequestConfig) => interceptor.config(config),
      (error: AxiosError) => interceptor.error(error),
    );
  }

  private responseInterceptor() {
    this._http.interceptors.response.use(
      (response: AxiosResponse): any => {
        if (this._mode === 'HALF_OPEN') {
          this.mode = 'CLOSED';
        }
        return {
          config: response.config,
          data: response.data,
          status: response.status,
        } as Result<any>;
      },
      // eslint-disable-next-line prefer-promise-reject-errors
      (error: AxiosError) =>
        Promise.reject({
          config: error.config,
          data: error.request,
          message: error.message,
          response: error.response,
        }),
    );
  }

  private requestInterceptor() {
    this._http.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (this.mode === 'OPEN') {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw {
            config,
            ...new axios.Cancel('Request cancel cause OPEN mode is activated'),
          };
        }
        if (config['axios-retry']) {
          const currentRetry = config['axios-retry']['retryCount'];
          if (currentRetry === this.maxRetries) {
            this.mode = 'OPEN';
            setTimeout(() => {
              this.mode = 'HALF_OPEN';
            }, this.circuitDuration);
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw {
              config: {
                ...config,
                retryCount: currentRetry,
              },
              ...new axios.Cancel('Request cancel cause OPEN mode is activated'),
            };
          }
          this.mode = 'CLOSED';
          return { ...config, retryCount: currentRetry };
        }
        this.mode = 'CLOSED';
        return config;
      },
      (error: AxiosError) => Promise.reject(errorFormatter(error)),
    );
  }

  public configureRetry(options: IConfigureRetry) {
    axiosRetry(this._http, {
      retries: this.mode === 'CLOSED' ? this.maxRetries : 0,
      retryCondition: (error: AxiosError) => {
        if (error.response) {
          if (this._preventRetryHttpStatus.includes(error.response.status)) {
            return true;
          }
        }
        return options.retryCondition(error);
      },
      shouldResetTimeout: options.shouldResetTimeOut,
      retryDelay: () =>
        !options.useExponentialRetryDelay ? options.retryDelay : exponentialDelay(this.maxRetries),
    });
  }

  public async get<T>(path: string, params?: any, headers?: object): Promise<Result<T>> {
    if (headers) {
      this.setAdditionnalHeaders(headers, true);
    }
    const result = await this._http({
      method: 'GET',
      url: path,
      params,
      headers: this._options ? { ...this._options.headers } : axios.defaults.headers,
      ...this.hydrateConfig(this._config),
    });
    return result;
  }

  public async post<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>> {
    if (headers) {
      this.setAdditionnalHeaders(headers, true);
    }
    const result = await this._http({
      method: 'POST',
      url: path,
      headers: this._options ? { ...this._options.headers } : axios.defaults.headers,
      data,
      params,
      ...this.hydrateConfig(this._config),
    });
    return result;
  }

  public async patch<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>> {
    if (headers) {
      this.setAdditionnalHeaders(headers, true);
    }
    const result = await this._http({
      method: 'PATCH',
      url: path,
      data,
      params,
      headers: this._options ? { ...this._options.headers } : axios.defaults.headers,
      ...this.hydrateConfig(this._config),
    });
    return result;
  }

  public async put<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>> {
    if (headers) {
      this.setAdditionnalHeaders(headers, true);
    }
    const result = await this._http({
      method: 'PUT',
      url: path,
      data,
      params,
      headers: this._options ? { ...this._options.headers } : axios.defaults.headers,
      ...this.hydrateConfig(this._config),
    });
    return result;
  }

  public async delete<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>> {
    if (headers) {
      this.setAdditionnalHeaders(headers, true);
    }
    const result = await this._http({
      method: 'DELETE',
      url: path,
      params,
      data,
      headers: this._options ? { ...this._options.headers } : axios.defaults.headers,
      ...this.hydrateConfig(this._config),
    });
    return result;
  }
}
