import { Result, IConfigureRetry, Interceptor } from '../types';

export abstract class HttpMethods {
  public _http: any;

  protected _options: object;

  protected readonly _instance;

  public maxRetries: number;

  public circuitDuration: number;

  protected _config: object;

  protected _preventRetryHttpStatus: number[] = [502, 503];

  private _baseUrl: string;

  private _timeout: number;

  public abstract get<T>(path: string, params?: any, headers?: object): Promise<Result<T>>;

  public abstract post<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>>;

  public abstract patch<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>>;

  public abstract put<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>>;

  public abstract delete<T>(path: string, data?: any, params?: any, headers?: object): Promise<Result<T>>;

  public abstract configureRetry(options: IConfigureRetry): void;

  public abstract setAdditionnalHeaders<T extends object>(config: T, override?: boolean): void;

  abstract setResponseInterceptor(interceptor: Omit<Interceptor, 'config'>): void;

  abstract setRequestInterceptor(interceptor: Omit<Interceptor, 'response'>): void;

  public set setTimeout(timeout: number) {
    this._timeout = timeout;
  }

  public set setPreventStatusCodes(statusCodes: number[]) {
    this._preventRetryHttpStatus = statusCodes;
  }

  public set httpConfiguration(config: object) {
    this._config = config;
  }

  public set options(options: object) {
    this._options = {
      headers: options,
    };
  }

  public set setBaseUrl(url: string) {
    this._baseUrl = url;
  }

  public get instance() {
    return this._instance;
  }

  public get config() {
    return this._options;
  }

  public get client() {
    return this._http;
  }
}
