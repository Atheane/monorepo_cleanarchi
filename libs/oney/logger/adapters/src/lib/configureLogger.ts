import { SymLogger } from '@oney/logger-core';
import { Container } from 'inversify';
import { Logger as WinstonLogger, LoggerOptions } from 'winston';
import { DefaultLoggerContainer } from './DefaultLoggerContainer';
import { DefaultOneyLoggerBuild } from './DefaultOneyLoggerBuild';
import { LogBroker } from './logger/LogBroker';

export function configureLogger(
  container: Container,
  optionsOrLogger?: LoggerOptions | WinstonLogger,
): DefaultLoggerContainer {
  const logger = new DefaultOneyLoggerBuild()
    .initializeDefaultSinks()
    .initializeDefaultTransformers()
    .useWinston(optionsOrLogger);

  container.bind(LogBroker).toConstantValue(logger);
  container.bind(SymLogger).toConstantValue(logger);

  return logger;
}
