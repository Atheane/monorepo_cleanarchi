import { Logger } from './Logger';

export interface LoggerWithMakeableChild<T extends Logger> {
  createChild(): T;
}
