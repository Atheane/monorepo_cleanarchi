import { Bad, Ok } from '@oney/result';
import { LogSink } from '../sinks/LogSink';

export const LoggerWithSinksErrors = {
  SINK_ALREADY_REGISTERED: 'SINK_ALREADY_REGISTERED' as const,
  SINK_NOT_FOUND: 'SINK_NOT_FOUND' as const,
};

export interface LoggerWithSinks {
  registerSink(sink: LogSink): Ok | Bad<'SINK_ALREADY_REGISTERED'>;
  unregisterSink(sink: LogSink): Ok | Bad<'SINK_NOT_FOUND'>;
}
