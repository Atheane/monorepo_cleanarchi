import { Result } from './types/LongPolling';

export interface ILongPolling {
  polling<T>(request: () => Promise<Result<T>>, successCondition: (response) => boolean): Promise<T>;
}
