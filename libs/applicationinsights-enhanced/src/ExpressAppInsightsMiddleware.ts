import { TelemetryClient } from 'applicationinsights';
import { Application, NextFunction, Request, Response } from 'express';
import { HttpClientInterceptor } from './HttpClientInterceptor';
import * as appInsights from './applicationinsights-enhanced';

/**
 * Middleware for tracking request and response body to Application Insight
 * @param {Application} app the express application
 * @param config the application insight configuration
 */
export class ExpressAppInsightsMiddleware {
  configure<Req, Res>(
    app: Application,
    config?: {
      instrumentationKey?: string;
      trackBodies?: boolean;
      traceConsoleLogs?: boolean;
    },
    httpClientInterceptor?: HttpClientInterceptor<Req, Res>,
  ) {
    const {
      instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
      trackBodies = true,
      traceConsoleLogs = true,
    } = config || {};
    const configuration = appInsights
      .setup(instrumentationKey)
      .setBodyTracking(trackBodies, httpClientInterceptor)
      .setAutoCollectRequests(false)
      .setAutoCollectHeartbeat(true)
      .setAutoCollectDependencies(true)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectConsole(true, traceConsoleLogs)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      .setInternalLogging(false, false)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI);

    // console.log('appInsights:', appInsights);
    // console.log('defaultClient:', configuration.defaultClient);
    // console.log("defaultClient:", appInsights.defaultClient)
    // console.log("defaultClient default:", appInsights.default.defaultClient)

    app.use(this.appInsightMiddleware(configuration.defaultClient));
    if (trackBodies) {
      app.use(this.appInsightHijackResBody(configuration.defaultClient));
    }

    return configuration;
  }

  private appInsightMiddleware = (telemetryClient: TelemetryClient) => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    telemetryClient.trackNodeHttpRequest({
      request: req,
      response: res,
    });
    next();
  };

  private appInsightHijackResBody = (telemetryClient: TelemetryClient) => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const send = res.send;
    res.send = function (data: any) {
      const body = data instanceof Buffer ? data.toString() : data;
      telemetryClient.commonProperties = {
        reqHeaders: req.headers as any,
        reqBody: req.body,
        // resHeaders: res.headers,
        resBody: body,
      };
      // console.log('client.commonProperties:', telemetryClient.commonProperties);
      return send.call(this, data);
    };
    next();
  };
}
