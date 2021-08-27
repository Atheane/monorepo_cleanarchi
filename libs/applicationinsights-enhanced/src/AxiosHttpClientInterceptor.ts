import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClientInterceptor } from './HttpClientInterceptor';
import { HttpResponse } from './HttpResponse';

export class AxiosHttpClientInterceptor
  implements HttpClientInterceptor<AxiosRequestConfig, AxiosResponse | AxiosError> {
  constructor(private axios: AxiosInstance) {}

  setRequestInterceptor(onRequestInterceptor: (request: AxiosRequestConfig) => AxiosRequestConfig): Function {
    const interceptor = this.axios.interceptors.request.use((request: AxiosRequestConfig) => {
      onRequestInterceptor(request);
      return request;
    });
    return () => {
      this.axios.interceptors.request.eject(interceptor);
    };
  }

  setResponseInterceptor(
    onResponseInterceptor: (response: AxiosResponse | AxiosError) => AxiosResponse,
  ): Function {
    const interceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return onResponseInterceptor(response);
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          onResponseInterceptor(response);
        } else {
          onResponseInterceptor(error);
        }
        return Promise.reject(error);
      },
    );
    return () => {
      this.axios.interceptors.response.eject(interceptor);
    };
  }

  convertResponse(
    response: AxiosResponse & { config: AxiosRequestConfig & { latency: number } },
  ): HttpResponse {
    const {
      config: { method = '', data: reqBody, headers: reqHeaders, latency },
      data: resBody,
      headers: resHeaders,
      status,
    } = response;
    let {
      config: { url: baseURL = '' },
    } = response;

    const path = response.request.path || response.request._options.path;
    baseURL = baseURL.replace(path, '');
    return {
      baseURL,
      path,
      method,
      status,
      latency,
      reqHeaders,
      reqBody,
      resHeaders,
      resBody,
    };
  }
}
