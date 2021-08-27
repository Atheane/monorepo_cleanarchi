import { RequestOptions, IncomingMessage } from 'http';

export interface InterceptedResponse {
  config: RequestOptions;
  res: IncomingMessage;
  reqBody: string;
  resBody: string;
}
