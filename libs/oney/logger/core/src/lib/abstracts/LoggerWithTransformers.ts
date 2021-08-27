import { Bad, Ok } from '@oney/result';
import { LogTransformer } from '../transformers/LogTransformer';

export const LoggerWithTransformersErrors = {
  TRANSFORMER_ALREADY_REGISTERED: 'TRANSFORMER_ALREADY_REGISTERED' as const,
  TRANSFORMER_NOT_FOUND: 'TRANSFORMER_NOT_FOUND' as const,
};

export interface LoggerWithTransformers {
  registerTransformer(transformer: LogTransformer): Ok | Bad<'TRANSFORMER_ALREADY_REGISTERED'>;
  unregisterTransformer(transformer: LogTransformer): Ok | Bad<'TRANSFORMER_NOT_FOUND'>;
}
