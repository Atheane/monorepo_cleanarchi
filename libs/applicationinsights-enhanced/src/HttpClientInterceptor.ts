import { RequestOptions } from 'http';
import { HttpResponse } from './HttpResponse';
import { InterceptedResponse } from './InterceptedResponse';

export interface HttpClientInterceptor<Req = RequestOptions, Res = InterceptedResponse> {
  setRequestInterceptor(onRequestInterceptor: (request: Req) => Req): Function;
  setResponseInterceptor(onResponseInterceptor: (response: Res) => Res): Function;
  convertResponse: (response: Res) => HttpResponse;
}
