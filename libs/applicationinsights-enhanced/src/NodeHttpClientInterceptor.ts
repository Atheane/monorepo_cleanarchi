import http, { RequestOptions, IncomingMessage, ClientRequest } from 'http';
import https from 'https';
import { HttpClientInterceptor } from './HttpClientInterceptor';
import { HttpResponse } from './HttpResponse';
import { InterceptedResponse } from './InterceptedResponse';

export class NodeHttpClientInterceptor implements HttpClientInterceptor<RequestOptions, InterceptedResponse> {
  originalHttpRequest = http.request;
  originalHttpsRequest = https.request;
  originalHttpServer = http.createServer;

  setRequestInterceptor(onRequestInterceptor: (request: RequestOptions) => RequestOptions): Function {
    // console.log("http:", http.request)
    // console.log('https:', https.request);
    http.request = interceptRequest(http.request, onRequestInterceptor) as any;
    https.request = interceptRequest(https.request, onRequestInterceptor) as any;
    return () => {
      http.request = this.originalHttpRequest;
      https.request = this.originalHttpsRequest;
    };
  }

  setResponseInterceptor(
    onResponseInterceptor: (response: InterceptedResponse) => InterceptedResponse,
  ): Function {
    http.request = interceptResponse(http.request, onResponseInterceptor) as any;
    https.request = interceptResponse(https.request, onResponseInterceptor) as any;
    return () => {
      http.request = this.originalHttpRequest;
      https.request = this.originalHttpsRequest;
    };
  }

  convertResponse(
    response: InterceptedResponse & { config: http.RequestOptions & { ts: number; latency: number } },
  ): HttpResponse {
    const { config: options, res, reqBody, resBody } = response;
    const { protocol, host, hostname, path, method = '', headers: reqHeaders, latency } = options;
    const { statusCode: status = 0 } = res;
    const baseURL = `${protocol || ''}//${host || hostname}`;
    const resHeaders = res.headers;
    // console.log("interceptRequest:", { baseURL, path, method, statusCode });

    // console.log("status:", status);
    // console.log("path:", path);
    // console.log("baseURL:", baseURL);
    // console.log("method:", method);
    // console.log("latency:", latency);
    // console.log("reqBody:", reqBody);
    // console.log("reqHeader:", reqHeaders);
    // console.log("resBody:", resBody);
    // console.log("resHeaders:", resHeaders);

    return {
      baseURL,
      path: path || '',
      method,
      status,
      latency: latency || 0,
      reqHeaders,
      reqBody,
      resHeaders,
      resBody,
    };
  }
}

const interceptRequest = (
  request: (
    url: RequestOptions | string | URL,
    callback?: (res: IncomingMessage) => void,
  ) => http.ClientRequest,
  interceptor: (data: RequestOptions) => RequestOptions,
) => {
  return (options: RequestOptions, callback: (res: IncomingMessage) => void): ClientRequest => {
    const clientRequest = request(interceptor(options), callback);
    return clientRequest;
  };
};

export const interceptResponse = (
  request: (
    url: RequestOptions | string | URL,
    callback?: (res: IncomingMessage) => void,
  ) => http.ClientRequest,
  interceptor: (data: InterceptedResponse) => InterceptedResponse,
) => {
  return (options: RequestOptions, callback?: (res: IncomingMessage) => void): ClientRequest => {
    const requestBodyChunks: Buffer[] = [];
    const responseBodyChunks: Buffer[] = [];
    let newCallback = undefined;
    if (callback) {
      newCallback = (res: IncomingMessage) => {
        //   // Do logging logic here
        const reqBody = requestBodyChunks.join().toString();
        // console.log("Request body:", requestBodyChunks.join());
        // console.log("options:", options);
        res.on('data', function (chunk: Buffer) {
          responseBodyChunks.push(chunk);
        });
        res.on('end', function () {
          const resBody = responseBodyChunks.join().toString();
          interceptor({ config: options, reqBody, resBody, res });
          // console.log('callback:', { options, reqBody, resBody });
        });
        return callback(res);
      };
    }

    const clientRequest = request(options, newCallback);
    const oldWrite = clientRequest.write.bind(clientRequest);
    clientRequest.write = (data: Buffer) => {
      requestBodyChunks.push(data);
      return oldWrite(data);
    };

    return clientRequest;
  };
};
