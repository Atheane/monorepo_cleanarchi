import { TelemetryClient } from 'applicationinsights';
import { HttpClientInterceptor } from './HttpClientInterceptor';
import { HttpResponse } from './HttpResponse';

export class HttpClientTracker<Req, Res> {
  constructor(
    private httpClient: HttpClientInterceptor<Req, Res>,
    private telemetryClient: TelemetryClient,
  ) {}

  trackDependency(httpResponse: HttpResponse) {
    const { baseURL, path, method, latency, status, reqHeaders, reqBody, resHeaders, resBody } = httpResponse;
    // console.log('status:', status);
    // console.log('path:', path);
    // console.log('baseURL:', baseURL);
    // console.log('latency:', latency);
    // console.log('method:', method);
    // console.log('reqBody:', reqBody);
    // console.log('reqHeaders:', reqHeaders);
    // console.log('resBody:', resBody);
    // console.log('resHeaders:', resHeaders);
    this.telemetryClient.trackDependency({
      target: baseURL,
      name: `${method.toUpperCase()} ${path}`,
      data: baseURL + path,
      duration: latency,
      resultCode: status,
      success: status < 400,
      dependencyTypeName: 'API',
      properties: {
        reqHeaders,
        reqBody,
        resBody,
        resHeaders,
      },
    });
  }

  private httpClientTiming = (instance: HttpClientInterceptor<Req, Res>) => {
    const removeRequestInterceptor = instance.setRequestInterceptor((request: Req & { ts: number }) => {
      const ts = Date.now();
      // console.log("timing start:", ts);
      request.ts = ts;
      // console.log("request:", request);
      return request;
    });

    const removeReponseInterceptor = instance.setResponseInterceptor(
      (response: Res & { config: any & { ts: number; latency: number } }) => {
        const timeInMs = Number(Date.now() - response.config.ts).toFixed();
        response.config.latency = timeInMs;
        // console.log('timing end:', response.config.latency);
        return response;
      },
    );

    return {
      removeRequestInterceptor,
      removeReponseInterceptor,
    };
  };

  private httpClientTracking = (instance: HttpClientInterceptor<Req, Res>) => {
    const removeReponseInterceptor = instance.setResponseInterceptor((response: Res) => {
      const httpResponse = instance.convertResponse(response);
      const { baseURL, path, method, status, reqHeaders } = httpResponse;
      if (
        baseURL &&
        path &&
        method &&
        reqHeaders &&
        status &&
        !baseURL.includes('services.visualstudio.com')
      ) {
        this.trackDependency(httpResponse);
      }

      return response;
    });

    return {
      removeReponseInterceptor,
    };
  };

  track = () => {
    const {
      removeRequestInterceptor: removeTimingRequestInterceptor,
      removeReponseInterceptor: removeTimingReponseInterceptor,
    } = this.httpClientTiming(this.httpClient);
    const { removeReponseInterceptor: removeTrackingReponseInterceptor } = this.httpClientTracking(
      this.httpClient,
    );
    return {
      untrack: () => {
        removeTimingRequestInterceptor();
        removeTimingReponseInterceptor();
        removeTrackingReponseInterceptor();
      },
    };
  };
}
