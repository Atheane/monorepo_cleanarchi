import {
  IHttpBuilder,
  HttpExecutableCommand,
  ChainableHttp,
  BuilderConfiguration,
  BuilderMethod,
} from './builder.types';
import { HttpMethods } from '../http';
import { CommandType, RequestType, Result, IConfigureRetry, Interceptor } from '../types';
// eslint-disable-next-line no-irregular-whitespace

function chainableHttpRequest(
  path: string,
  instance: HttpMethods,
  commandType: CommandType,
  requestsHistory?: RequestType[],
  data?: any,
  params?: any,
  headers?: object,
): ChainableHttp {
  return {
    with(): BuilderMethod {
      const requests: RequestType[] = [];
      if (!requestsHistory) {
        requests.push({
          commandType,
          config: instance.config,
          path,
          data,
          params,
          headers,
        });
      }
      return {
        ...httpRequestMethods(instance, requestsHistory || requests),
      };
    },
  };
}

async function getResolvedResponse<T>(
  path: string,
  instance: HttpMethods,
  commandType: CommandType,
  data?: any,
  params?: any,
  headers?: object,
): Promise<Result<T>> {
  let result: Result<T>;
  if (commandType === 'GET') {
    result = await instance.get<T>(path, params, headers);
  }
  if (commandType === 'POST') {
    result = await instance.post<T>(path, data, params, headers);
  }
  if (commandType === 'PATCH') {
    result = await instance.patch<T>(path, data, params, headers);
  }
  if (commandType === 'PUT') {
    result = await instance.put<T>(path, data, params, headers);
  }
  if (commandType === 'DELETE') {
    result = await instance.delete<T>(path, data, params, headers);
  }
  return result;
}

function executableCommand<T>(
  path: string,
  instance: HttpMethods,
  commandType: CommandType,
  requests: RequestType[],
  data?: any,
  params?: any,
  headers?: object,
): HttpExecutableCommand<T> {
  return {
    async execute(): Promise<Result<T>> {
      const result = await getResolvedResponse<T>(path, instance, commandType, data, params, headers);
      return result;
    },
    async executeAll(): Promise<Result<T>[]> {
      const responses = [];
      for await (const item of requests) {
        const resolvedResponses = await getResolvedResponse<T>(
          item.path,
          instance,
          item.commandType,
          item.data,
          item.params,
          headers,
        );
        if (resolvedResponses.data) {
          responses.push(data);
        } else {
          throw data;
        }
      }
      return responses;
    },
  };
}

function httpRequestMethods(instance: HttpMethods, requests?: RequestType[]): BuilderMethod {
  const { config } = instance;
  return {
    get<T>(path: string, params?: any, headers?: object): ChainableHttp & HttpExecutableCommand<T> {
      if (requests) {
        requests.push({
          path,
          config,
          commandType: 'GET',
          data: null,
          params,
          headers,
        });
      }
      return {
        ...chainableHttpRequest(path, instance, 'GET', requests, null, params, headers),
        ...executableCommand<T>(path, instance, 'GET', requests, null, params, headers),
      };
    },
    post<T>(
      path: string,
      data: any,
      params?: any,
      headers?: object,
    ): ChainableHttp & HttpExecutableCommand<T> {
      if (requests) {
        requests.push({
          path,
          config,
          commandType: 'POST',
          data,
          params,
          headers,
        });
      }
      return {
        ...chainableHttpRequest(path, instance, 'POST', requests, data, params, headers),
        ...executableCommand<T>(path, instance, 'POST', requests, data, params, headers),
      };
    },
    patch<T>(
      path: string,
      data?: any,
      params?: any,
      headers?: object,
    ): ChainableHttp & HttpExecutableCommand<T> {
      if (requests) {
        requests.push({
          path,
          config,
          commandType: 'PATCH',
          data,
          params,
          headers,
        });
      }
      return {
        ...chainableHttpRequest(path, instance, 'PATCH', requests, data, params, headers),
        ...executableCommand<T>(path, instance, 'PATCH', requests, data, params, headers),
      };
    },
    put<T>(
      path: string,
      data?: any,
      params?: any,
      headers?: object,
    ): ChainableHttp & HttpExecutableCommand<T> {
      if (requests) {
        requests.push({
          path,
          config,
          commandType: 'PUT',
          data,
          params,
          headers,
        });
      }
      return {
        ...chainableHttpRequest(path, instance, 'PUT', requests, data, params, headers),
        ...executableCommand<T>(path, instance, 'PUT', requests, data, params, headers),
      };
    },
    delete<T>(
      path: string,
      data?: any,
      params?: any,
      headers?: object,
    ): ChainableHttp & HttpExecutableCommand<T> {
      if (requests) {
        requests.push({
          path,
          config,
          commandType: 'DELETE',
          data,
          params,
          headers,
        });
      }
      return {
        ...chainableHttpRequest(path, instance, 'DELETE', requests, data, params, headers),
        ...executableCommand<T>(path, instance, 'DELETE', requests, data, params, headers),
      };
    },
  };
}

function configureClient(client: HttpMethods): BuilderConfiguration {
  return {
    setResponseInterceptor(interceptor: Omit<Interceptor, 'config'>): BuilderConfiguration & BuilderMethod {
      client.setResponseInterceptor(interceptor);
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    setRequestInterceptor(interceptor: Omit<Interceptor, 'response'>): BuilderConfiguration & BuilderMethod {
      client.setRequestInterceptor(interceptor);
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    setDefaultHeaders<T extends object>(options: T): BuilderConfiguration & BuilderMethod {
      // eslint-disable-next-line no-param-reassign
      client.options = options;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    setAdditionnalHeaders<T extends object>(config: T, override: boolean) {
      client.setAdditionnalHeaders<T>(config, override);
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    setBaseUrl(url: string): BuilderConfiguration & BuilderMethod {
      client.setBaseUrl = url;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    setResponseTimeout(duration: number): BuilderConfiguration & BuilderMethod {
      client.setTimeout = duration;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    configureRetry(options: IConfigureRetry): BuilderConfiguration & BuilderMethod {
      client.configureRetry(options);
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    getConfiguration<T extends object>(): T {
      return client.config as T;
    },
    getClient<T>(): T {
      return client._http as T;
    },
    getInstance<T>(): T {
      return client.instance as T;
    },
    setMaxRetries(number: number): BuilderConfiguration & BuilderMethod {
      client.maxRetries = number;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    circuitDuration(duration: number): BuilderConfiguration & BuilderMethod {
      client.circuitDuration = duration;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    statusCodesForRetry(statusCodes: number[]): BuilderConfiguration & BuilderMethod {
      client.setPreventStatusCodes = statusCodes;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
    setRequestsConfiguration<T extends object>(config: T): BuilderConfiguration & BuilderMethod {
      client.httpConfiguration = config;
      return {
        ...configureClient(client),
        ...httpRequestMethods(client),
      };
    },
  };
}

export function httpBuilder<I extends HttpMethods>(client: I): IHttpBuilder {
  return {
    ...configureClient(client),
    ...httpRequestMethods(client),
  };
}
