export interface HttpResponse {
  baseURL: string;
  path: string;
  method: string;
  latency: number;
  status: number;
  reqHeaders: any;
  reqBody: any;
  resHeaders: any;
  resBody: any;
}
