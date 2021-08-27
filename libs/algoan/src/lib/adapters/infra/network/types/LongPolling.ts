export interface PollingOptions {
  interval: number;
  successCondition: (result) => boolean;
  attemps: number;
}

export interface LongPollingConfig {
  maxAttemps: number;
  interval: number;
}

export interface Result<T> {
  status: number;
  data: T;
  config: any;
}
