import { DecoratedLogTransformer, Obfuscate, Omit } from '@oney/logger-adapters';
import { Log } from '@oney/logger-core';
import { ConsoleLogSink, consoleLogSinkFactory } from './fixtures/ConsoleLogSink';
import { LogBroker } from '../logger/LogBroker';

function loggerfactory() {
  return new LogBroker();
}

function create_DecoratedLogTransformer() {
  return new DecoratedLogTransformer();
}

describe('DecoratedLogTransformer', () => {
  let logger: LogBroker;
  let consoleSink: ConsoleLogSink;
  let transformer: DecoratedLogTransformer;

  let lastReceivedRawLog: Log;
  let lastReceivedTransformedLog: Log;

  beforeEach(() => {
    logger = loggerfactory();

    consoleSink = consoleLogSinkFactory();
    consoleSink.onRawLog = log => (lastReceivedRawLog = log);
    consoleSink.onTransformedLog = log => (lastReceivedTransformedLog = log);
    logger.registerSink(consoleSink);

    transformer = create_DecoratedLogTransformer();
    logger.registerTransformer(transformer);
  });

  it('should obfuscate', () => {
    class Foo {
      constructor(input: string) {
        this.bar = input;
      }

      @Obfuscate()
      bar: string;
    }

    logger.info('Chaloupe', { foo: new Foo('something') });

    expect(lastReceivedRawLog.meta).toEqual({ foo: { bar: 'something' } });
    expect(lastReceivedTransformedLog.meta).toEqual({ foo: { bar: '[bar]' } });
  });

  it('should omit', () => {
    class Foo {
      constructor(input: string) {
        this.bar = input;
      }

      @Omit()
      bar: string;
    }

    logger.info('Chavire', { foo: new Foo('something') });

    expect(lastReceivedRawLog.meta).toEqual({ foo: { bar: 'something' } });
    expect(lastReceivedTransformedLog.meta).toEqual({ foo: {} });
  });

  it('omit should override obfuscate', () => {
    class Foo {
      constructor(input: string) {
        this.omitObfuscate = input;
        this.obfuscateOmit = input;
      }

      @Omit()
      @Obfuscate()
      omitObfuscate: string;

      @Obfuscate()
      @Omit()
      obfuscateOmit: string;
    }

    logger.info('Chavire', { foo: new Foo('something') });

    expect(lastReceivedRawLog.meta).toEqual({
      foo: { omitObfuscate: 'something', obfuscateOmit: 'something' },
    });
    expect(lastReceivedTransformedLog.meta).toEqual({ foo: {} });
  });

  it('should omit extended', () => {
    class Foo {
      constructor(input: string) {
        this.bar = input;
      }

      @Omit()
      bar: string;
    }

    class ExtendedFoo extends Foo {
      bar: string;
    }

    logger.info('Foo', { foo: new ExtendedFoo('something') });

    expect(lastReceivedRawLog.meta).toEqual({ foo: { bar: 'something' } });
    expect(lastReceivedTransformedLog.meta).toEqual({ foo: {} });
  });

  it('currently getter should not be displayed', () => {
    class Foo {
      constructor(input: string) {
        this.bar = input;
      }

      @Omit()
      bar: string;

      get barGetter() {
        return this.bar;
      }
    }

    logger.info('Foo', { foo: new Foo('something') });

    expect(lastReceivedRawLog.meta).toEqual({ foo: { bar: 'something' } });
    expect(lastReceivedTransformedLog.meta).toEqual({ foo: {} });
  });
});
