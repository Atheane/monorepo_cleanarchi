import { AlertDispatcherFromLogger } from './alert/AlertDispatcherFromLogger';
import { DefaultLoggerContainer } from './DefaultLoggerContainer';

// todo avoid to expose the all LogBroker interface / api
export const defaultLogger = new DefaultLoggerContainer();

export const defaultAlert = new AlertDispatcherFromLogger(defaultLogger);
