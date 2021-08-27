import { Logger as TsLogger } from 'tslog';
import { createLogger, Logger as WinstonLogger, transports } from 'winston';
import { DefaultOneyLoggerBuild } from '../DefaultOneyLoggerBuild';
import { LogBroker } from '../logger/LogBroker';
import SpyInstance = jest.SpyInstance;

describe('DefaultOneyLoggerBuild with TsLog', () => {
  let build: DefaultOneyLoggerBuild;
  let logger: LogBroker;
  let tslog: TsLogger;

  let spyOn_trace: SpyInstance;
  let spyOn_debug: SpyInstance;
  let spyOn_info: SpyInstance;
  let spyOn_warn: SpyInstance;
  let spyOn_error: SpyInstance;
  let spyOn_fatal: SpyInstance;

  beforeEach(() => {
    build = new DefaultOneyLoggerBuild();
    tslog = new TsLogger();

    logger = build.initializeDefaultSinks().initializeDefaultTransformers().useTsLog(tslog);

    // don't change the spyOn setup place
    // we don't want to track the initialization logs
    spyOn_trace = jest.spyOn(tslog, 'trace');
    spyOn_debug = jest.spyOn(tslog, 'debug');
    spyOn_info = jest.spyOn(tslog, 'info');
    spyOn_warn = jest.spyOn(tslog, 'warn');
    spyOn_error = jest.spyOn(tslog, 'error');
    spyOn_fatal = jest.spyOn(tslog, 'fatal');
  });

  it('should log TRACE', () => {
    logger.trace('TRACE', { userId: '3712' });

    expect(spyOn_trace).toHaveBeenCalledTimes(1);
  });

  it('should log DEBUG', () => {
    logger.debug('DEBUG', { userId: '3712' });

    expect(spyOn_debug).toHaveBeenCalledTimes(1);
  });

  it('should log INFO', () => {
    logger.info('INFO', { userId: '3712' });

    expect(spyOn_info).toHaveBeenCalledTimes(1);
  });

  it('should log WARN', () => {
    logger.warn('WARN', { userId: '3712' });

    expect(spyOn_warn).toHaveBeenCalledTimes(1);
  });

  it('should log ERROR', () => {
    logger.error('ERROR', { userId: '3712' });

    expect(spyOn_error).toHaveBeenCalledTimes(1);
  });

  it('should log FATAL', () => {
    logger.fatal('FATAL', { userId: '3712' });

    expect(spyOn_fatal).toHaveBeenCalledTimes(1);
  });
});

describe('DefaultOneyLoggerBuild with Winston logger', () => {
  let build: DefaultOneyLoggerBuild;
  let logger: LogBroker;
  let winston: WinstonLogger;

  let spyOn_log: SpyInstance;

  beforeEach(() => {
    build = new DefaultOneyLoggerBuild();
    winston = createLogger({
      transports: [
        new transports.Console({
          level: 'debug',
          handleExceptions: true,
        }),
      ],
    });

    logger = build.initializeDefaultSinks().initializeDefaultTransformers().useWinston(winston);

    spyOn_log = jest.spyOn(winston, 'log');
  });

  it('should log TRACE', () => {
    logger.trace('TRACE', { userId: '3712' });

    expect(spyOn_log).toHaveBeenCalledTimes(1);
    expect(spyOn_log).toBeCalledWith(
      expect.objectContaining({
        level: 'trace',
      }),
    );
  });

  it('should log DEBUG', () => {
    logger.debug('DEBUG', { userId: '3712' });

    expect(spyOn_log).toHaveBeenCalledTimes(1);
    expect(spyOn_log).toBeCalledWith(
      expect.objectContaining({
        level: 'debug',
      }),
    );
  });

  it('should log INFO', () => {
    logger.info('INFO', { userId: '3712' });

    expect(spyOn_log).toHaveBeenCalledTimes(1);
    expect(spyOn_log).toBeCalledWith(
      expect.objectContaining({
        level: 'info',
      }),
    );
  });

  it('should log WARN', () => {
    logger.warn('WARN', { userId: '3712' });

    expect(spyOn_log).toHaveBeenCalledTimes(1);
    expect(spyOn_log).toBeCalledWith(
      expect.objectContaining({
        level: 'warn',
      }),
    );
  });

  it('should log ERROR', () => {
    logger.error('ERROR', { userId: '3712' });

    expect(spyOn_log).toHaveBeenCalledTimes(1);
    expect(spyOn_log).toBeCalledWith(
      expect.objectContaining({
        level: 'error',
      }),
    );
  });

  it('should log FATAL', () => {
    logger.fatal('FATAL', { userId: '3712' });

    expect(spyOn_log).toHaveBeenCalledTimes(1);
    expect(spyOn_log).toBeCalledWith(
      expect.objectContaining({
        level: 'fatal',
      }),
    );
  });
});
