import { createLogger, Logger, transports } from 'winston';
import { WinstonLoggerSink } from '../../sinks/winston/WinstonLoggerSink';
import { LogBroker } from '../../logger/LogBroker';
import SpyInstance = jest.SpyInstance;

describe('WinstonLoggerSink', () => {
  let logger: LogBroker;
  let sink: WinstonLoggerSink;
  let winston: Logger;

  let spyOn_log: SpyInstance;

  beforeEach(() => {
    winston = createLogger({
      transports: [
        new transports.Console({
          level: 'debug',
          handleExceptions: true,
        }),
      ],
    });
    sink = new WinstonLoggerSink(winston);

    spyOn_log = jest.spyOn(winston, 'log');

    logger = new LogBroker();
    logger.registerSink(sink);
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
