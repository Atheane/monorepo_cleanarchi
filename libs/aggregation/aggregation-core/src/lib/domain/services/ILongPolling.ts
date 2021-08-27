import { Result } from '@oney/http';

export interface ILongPolling {
  polling<T>(request: () => Promise<Result<T>>, successCondition: (response) => boolean): Promise<T>;
}
