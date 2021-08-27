import { AxiosRequestConfig } from 'axios';

// eslint-disable-next-line no-irregular-whitespace
export type AxiosConfiguration = Omit<
  AxiosRequestConfig,
  'headers' | 'url' | 'method' | 'data' | 'params' | 'baseURL' | 'cancelToken' | 'timeout'
>;
