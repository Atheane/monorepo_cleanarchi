import { Logger } from 'tslog';
import { LogBroker } from '../../logger/LogBroker';
import { TsLogSink } from '../../sinks/tslog/TsLogSink';
import SpyInstance = jest.SpyInstance;

describe('TsLogSink', () => {
  let logger: LogBroker;
  let sink: TsLogSink;
  let tslog: Logger;

  let spyOn_trace: SpyInstance;
  let spyOn_debug: SpyInstance;
  let spyOn_info: SpyInstance;
  let spyOn_warn: SpyInstance;
  let spyOn_error: SpyInstance;
  let spyOn_fatal: SpyInstance;

  beforeEach(() => {
    tslog = new Logger();
    sink = new TsLogSink(tslog);

    spyOn_trace = jest.spyOn(tslog, 'trace');
    spyOn_debug = jest.spyOn(tslog, 'debug');
    spyOn_info = jest.spyOn(tslog, 'info');
    spyOn_warn = jest.spyOn(tslog, 'warn');
    spyOn_error = jest.spyOn(tslog, 'error');
    spyOn_fatal = jest.spyOn(tslog, 'fatal');

    logger = new LogBroker();
    logger.registerSink(sink);
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
