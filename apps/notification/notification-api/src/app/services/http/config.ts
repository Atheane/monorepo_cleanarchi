import { AxiosHttpMethod, httpBuilder } from '@oney/http';

const httpService = new AxiosHttpMethod();

export const http = httpBuilder(httpService);
