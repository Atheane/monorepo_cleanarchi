import * as appInsights from 'applicationinsights';
import { IDisabledExtendedMetrics } from 'applicationinsights/out/AutoCollection/NativePerformance';
import { OutgoingMessage } from 'http';
import { HttpClientInterceptor } from './HttpClientInterceptor';
import { HttpClientTracker } from './HttpClientTracker';
import { NodeHttpClientInterceptor } from './NodeHttpClientInterceptor';

// export let defaultClient: appInsights.TelemetryClient  | null

export const setup = (setupString?: string): typeof TrackerConfiguration => {
  appInsights.setup(setupString);
  // defaultClient = appInsights.defaultClient
  return TrackerConfiguration;
};

export class TrackerConfiguration extends appInsights.Configuration {
  static untrack: () => void;
  static get defaultClient() {
    return appInsights.defaultClient;
  }

  /**
   * Starts automatic collection of telemetry. Prior to calling start no
   * telemetry will be *automatically* collected, though manual collection
   * is enabled.
   * @returns {ApplicationInsights} this class
   */
  static start() {
    super.start();
    return this;
  }

  static setBodyTracking<Req, Res>(
    enable: boolean,
    httpClientInterceptor?: HttpClientInterceptor<Req, Res>,
  ): typeof TrackerConfiguration {
    const telemetryClient = this.defaultClient;
    // console.log('setBodyTracking:', telemetryClient);
    if (enable) {
      if (!httpClientInterceptor) {
        httpClientInterceptor = new NodeHttpClientInterceptor() as any;
      }
      const tracker = new HttpClientTracker(httpClientInterceptor, telemetryClient);
      const { untrack } = tracker.track();
      this.untrack = untrack;
    }

    telemetryClient.addTelemetryProcessor((envelope, context) => {
      const { baseData } = envelope.data as any;
      const { type } = baseData;
      if (enable && type === 'Http') {
        // disable auto http dependency collection
        return false;
      }
      if (context) {
        // const httpRequest: IncomingMessage = context['http.ServerRequest'];
        const httpResponse: OutgoingMessage = context['http.ServerResponse'];
        // domainSupportsProperties isn't required in JS - but allows type safety in TS
        // And adds type hinting for the 'properties' field in JS when using vscode
        if (httpResponse && appInsights.Contracts.domainSupportsProperties(baseData)) {
          // Object.entries(httpResponse._headers).forEach(
          //   ([headerName, headerValue]) => {
          //     console.log('resHeader:', { headerName, headerValue });
          //     baseData.properties[`header-${headerName}`] = headerValue;
          //   }
          // );
          baseData.properties.resHeaders = JSON.stringify(httpResponse.getHeaders());
          // console.log('envelope', baseData.properties);
        }
      }
      return true;
    });
    return this;
  }

  /**
   * Sets the distributed tracing modes. If W3C mode is enabled, W3C trace context
   * headers (traceparent/tracestate) will be parsed in all incoming requests, and included in outgoing
   * requests. In W3C mode, existing back-compatibility AI headers will also be parsed and included.
   * Enabling W3C mode will not break existing correlation with other Application Insights instrumented
   * services. Default=AI
   */
  static setDistributedTracingMode(value: appInsights.DistributedTracingModes): typeof TrackerConfiguration {
    super.setDistributedTracingMode(value);
    return this;
  }
  /**
   * Sets the state of console and logger tracking (enabled by default for third-party loggers only)
   * @param value if true logger activity will be sent to Application Insights
   * @param collectConsoleLog if true, logger autocollection will include console.log calls (default false)
   * @returns {Configuration} this class
   */
  static setAutoCollectConsole(value: boolean, collectConsoleLog?: boolean): typeof TrackerConfiguration {
    super.setAutoCollectConsole(value, collectConsoleLog);
    return this;
  }
  /**
   * Sets the state of exception tracking (enabled by default)
   * @param value if true uncaught exceptions will be sent to Application Insights
   * @returns {Configuration} this class
   */
  static setAutoCollectExceptions(value: boolean): typeof TrackerConfiguration {
    super.setAutoCollectExceptions(value);
    return this;
  }
  /**
   * Sets the state of performance tracking (enabled by default)
   * @param value if true performance counters will be collected every second and sent to Application Insights
   * @param collectExtendedMetrics if true, extended metrics counters will be collected every minute and sent to Application Insights
   * @returns {Configuration} this class
   */
  static setAutoCollectPerformance(
    value: boolean,
    collectExtendedMetrics?: boolean | IDisabledExtendedMetrics,
  ): typeof TrackerConfiguration {
    super.setAutoCollectPerformance(value, collectExtendedMetrics);
    return this;
  }
  /**
   * Sets the state of request tracking (enabled by default)
   * @param value if true HeartBeat metric data will be collected every 15 mintues and sent to Application Insights
   * @returns {Configuration} this class
   */
  static setAutoCollectHeartbeat(value: boolean): typeof TrackerConfiguration {
    super.setAutoCollectHeartbeat(value);
    return this;
  }
  /**
   * Sets the state of request tracking (enabled by default)
   * @param value if true requests will be sent to Application Insights
   * @returns {Configuration} this class
   */
  static setAutoCollectRequests(value: boolean): typeof TrackerConfiguration {
    super.setAutoCollectRequests(value);
    return this;
  }
  /**
   * Sets the state of dependency tracking (enabled by default)
   * @param value if true dependencies will be sent to Application Insights
   * @returns {Configuration} this class
   */
  static setAutoCollectDependencies(value: boolean): typeof TrackerConfiguration {
    super.setAutoCollectDependencies(value);
    return this;
  }
  /**
   * Sets the state of automatic dependency correlation (enabled by default)
   * @param value if true dependencies will be correlated with requests
   * @param useAsyncHooks if true, forces use of experimental async_hooks module to provide correlation. If false, instead uses only patching-based techniques. If left blank, the best option is chosen for you based on your version of Node.js.
   * @returns {Configuration} this class
   */
  static setAutoDependencyCorrelation(value: boolean, useAsyncHooks?: boolean): typeof TrackerConfiguration {
    super.setAutoDependencyCorrelation(value, useAsyncHooks);
    return this;
  }
  /**
   * Enable or disable disk-backed retry caching to cache events when client is offline (enabled by default)
   * Note that this method only applies to the default client. Disk-backed retry caching is disabled by default for additional clients.
   * For enable for additional clients, use client.channel.setUseDiskRetryCaching(true).
   * These cached events are stored in your system or user's temporary directory and access restricted to your user when possible.
   * @param value if true events that occured while client is offline will be cached on disk
   * @param resendInterval The wait interval for resending cached events.
   * @param maxBytesOnDisk The maximum size (in bytes) that the created temporary directory for cache events can grow to, before caching is disabled.
   * @returns {Configuration} this class
   */
  static setUseDiskRetryCaching(
    value: boolean,
    resendInterval?: number,
    maxBytesOnDisk?: number,
  ): typeof TrackerConfiguration {
    super.setUseDiskRetryCaching(value, resendInterval, maxBytesOnDisk);
    return this;
  }
  /**
   * Enables debug and warning logging for AppInsights itself.
   * @param enableDebugLogging if true, enables debug logging
   * @param enableWarningLogging if true, enables warning logging
   * @returns {Configuration} this class
   */
  static setInternalLogging(
    enableDebugLogging?: boolean,
    enableWarningLogging?: boolean,
  ): typeof TrackerConfiguration {
    super.setInternalLogging(enableDebugLogging, enableWarningLogging);
    return this;
  }
  /**
   * Enables communication with Application Insights Live Metrics.
   * @param enable if true, enables communication with the live metrics service
   */
  static setSendLiveMetrics(enable?: boolean): typeof TrackerConfiguration {
    super.setSendLiveMetrics(enable);
    return this;
  }
}

// export function dispose() {
//   appInsights.dispose();
//   // defaultClient = null;
//   return TrackerConfiguration;
// }

export default appInsights;
export * from 'applicationinsights';
