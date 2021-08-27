import { AlertDispatcherFromLogger } from '@oney/logger-adapters';
import { Log, LogLevel } from '@oney/logger-core';
import { ConsoleLogSink, consoleLogSinkFactory } from './fixtures/ConsoleLogSink';
import { ToUppercaseTransformer, toUppercaseTransformerFactory } from './fixtures/ToUppercaseTransformer';
import { DefaultLoggerContainer } from '../DefaultLoggerContainer';
import { LogBroker } from '../logger/LogBroker';

function loggerfactory() {
  return new LogBroker();
}

function logFactory(level: LogLevel, message: string, meta?: any) {
  return new Log(level, message, meta);
}

describe('DefaultLoggerContainer', () => {
  let defaultLoggerContainer: DefaultLoggerContainer;

  let consoleSink: ConsoleLogSink;
  let spyOn_onRawLog;
  let spyOn_onTransformedLog;

  let toUppercaseTransformer: ToUppercaseTransformer;
  let spyOn_transforms;

  beforeEach(() => {
    defaultLoggerContainer = new DefaultLoggerContainer();

    defaultLoggerContainer.unregisterSink(consoleSink);
    defaultLoggerContainer.unregisterTransformer(toUppercaseTransformer);

    jest.resetAllMocks();

    consoleSink = consoleLogSinkFactory();
    spyOn_onRawLog = jest.spyOn(consoleSink, 'onRawLog');
    spyOn_onTransformedLog = jest.spyOn(consoleSink, 'onTransformedLog');

    toUppercaseTransformer = toUppercaseTransformerFactory();
    spyOn_transforms = jest.spyOn(toUppercaseTransformer, 'transforms');
  });

  it('setDefaultLogger should log changes', () => {
    const logger = loggerfactory();
    logger.registerSink(consoleSink);

    defaultLoggerContainer.setDefaultLogger(logger);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
  });

  it('setDefaultLogger should be able to register and unregister sink', () => {
    defaultLoggerContainer.registerSink(consoleSink);
    defaultLoggerContainer.unregisterSink(consoleSink);

    defaultLoggerContainer.info('something');

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(0);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(0);
  });

  it('setDefaultLogger should be able to register and unregister transformer', () => {
    defaultLoggerContainer.registerTransformer(toUppercaseTransformer);
    defaultLoggerContainer.unregisterTransformer(toUppercaseTransformer);

    defaultLoggerContainer.info('something');

    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(0);
  });

  it('setDefaultLogger should forward logs transformations', () => {
    defaultLoggerContainer.registerSink(consoleSink);
    defaultLoggerContainer.registerTransformer(toUppercaseTransformer);

    const rawExpected = logFactory(LogLevel.INFO, 'something');
    const transformedExpected = logFactory(LogLevel.INFO, 'SOMETHING');

    defaultLoggerContainer.log(rawExpected.level, rawExpected.message, rawExpected.meta);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(rawExpected);

    expect(spyOn_transforms).toHaveBeenCalledTimes(1);
    expect(spyOn_transforms).toBeCalledWith(rawExpected);

    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(transformedExpected);
  });

  it('setDefaultLogger should forward INFO logs', () => {
    defaultLoggerContainer.registerSink(consoleSink);

    const expected = logFactory(LogLevel.INFO, 'INFO');

    defaultLoggerContainer.info(expected.message);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(expected);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(expected);
  });

  it('setDefaultLogger should forward DEBUG logs', () => {
    defaultLoggerContainer.registerSink(consoleSink);

    const expected = logFactory(LogLevel.DEBUG, 'DEBUG');

    defaultLoggerContainer.debug(expected.message);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(expected);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(expected);
  });

  it('setDefaultLogger should forward ERROR logs', () => {
    defaultLoggerContainer.registerSink(consoleSink);

    const expected = logFactory(LogLevel.ERROR, 'ERROR');

    defaultLoggerContainer.error(expected.message);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(expected);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(expected);
  });

  it('setDefaultLogger should forward TRACE logs', () => {
    defaultLoggerContainer.registerSink(consoleSink);

    const expected = logFactory(LogLevel.TRACE, 'TRACE');

    defaultLoggerContainer.trace(expected.message);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(expected);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(expected);
  });

  it('setDefaultLogger should forward FATAL logs', () => {
    defaultLoggerContainer.registerSink(consoleSink);

    const expected = logFactory(LogLevel.FATAL, 'FATAL');

    defaultLoggerContainer.fatal(expected.message);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(expected);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(expected);
  });

  it('setDefaultLogger should forward WARN logs', () => {
    defaultLoggerContainer.registerSink(consoleSink);

    const expected = logFactory(LogLevel.WARN, 'WARN');

    defaultLoggerContainer.warn(expected.message);

    expect(spyOn_onRawLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onRawLog).toBeCalledWith(expected);
    expect(spyOn_onTransformedLog).toHaveBeenCalledTimes(1);
    expect(spyOn_onTransformedLog).toBeCalledWith(expected);
  });
});

describe('DefaultAlert', () => {
  let defaultLoggerContainer: DefaultLoggerContainer;
  let defaultAlert: AlertDispatcherFromLogger;

  let consoleSink: ConsoleLogSink;
  let lastReceivedLog: Log;
  let alertMarker: string;

  beforeEach(() => {
    lastReceivedLog = undefined;

    defaultLoggerContainer = new DefaultLoggerContainer();

    consoleSink = consoleLogSinkFactory();

    consoleSink.onTransformedLog = log => {
      lastReceivedLog = log;
    };

    defaultLoggerContainer.registerSink(consoleSink);

    defaultAlert = new AlertDispatcherFromLogger(defaultLoggerContainer);

    alertMarker = '[[ALERT]]';
  });

  it('alert should forward INFO logs', () => {
    defaultAlert.info('INFO');

    expect(lastReceivedLog.message).toContain(alertMarker);
  });

  it('setDefaultLogger should forward DEBUG logs', () => {
    defaultAlert.debug('DEBUG');

    expect(lastReceivedLog.message).toContain(alertMarker);
  });

  it('setDefaultLogger should forward ERROR logs', () => {
    defaultAlert.error('ERROR');

    expect(lastReceivedLog.message).toContain(alertMarker);
  });

  it('setDefaultLogger should forward TRACE logs', () => {
    defaultAlert.trace('TRACE');

    expect(lastReceivedLog.message).toContain(alertMarker);
  });

  it('setDefaultLogger should forward FATAL logs', () => {
    defaultAlert.fatal('FATAL');

    expect(lastReceivedLog.message).toContain(alertMarker);
  });

  it('setDefaultLogger should forward WARN logs', () => {
    defaultAlert.warn('WARN');

    expect(lastReceivedLog.message).toContain(alertMarker);
  });
});
