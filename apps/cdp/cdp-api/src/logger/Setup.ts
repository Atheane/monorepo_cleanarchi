import { DefaultOneyLoggerBuild, LogBroker } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { Container } from 'inversify';

export function SetupLogger(container: Container) {
  const logger = new DefaultOneyLoggerBuild()
    .initializeDefaultSinks()
    .initializeDefaultTransformers()
    .useWinston();

  container.bind(LogBroker).toConstantValue(logger);
  container.bind(SymLogger).toConstantValue(logger);

  return logger;
}
