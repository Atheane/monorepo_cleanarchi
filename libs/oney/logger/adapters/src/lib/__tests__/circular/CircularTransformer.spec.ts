import { DefaultOneyLoggerBuild, LogBroker } from '@oney/logger-adapters';
import { Logger as TsLogger } from 'tslog';
import { CycleHelper } from '../../transformers/circular/CycleHelper';

describe('CircularTransformer', () => {
  let build: DefaultOneyLoggerBuild;
  let logger: LogBroker;
  let tslog: TsLogger;

  beforeEach(() => {
    build = new DefaultOneyLoggerBuild();
    tslog = new TsLogger();

    logger = build.initializeDefaultSinks().initializeDefaultTransformers().useTsLog(tslog);
  });

  function makeCircularObject() {
    const model: any = { name: '3712' };
    model.content = model;

    return model;
  }

  it('should log with circular references object', () => {
    const model = makeCircularObject();

    const execute = () => logger.info('Circular', { model });

    expect(execute).not.toThrowError();
  });

  it('should log with circular array references', () => {
    const model = makeCircularObject();

    const execute = () => logger.info('Circular', { circularArray: [model, model] });

    expect(execute).not.toThrowError();
  });

  it('should be able to decycle and retrocycle an object', () => {
    const model = makeCircularObject();

    const decycle = CycleHelper.decycle(model);
    const retrocycle = CycleHelper.retrocycle(decycle);

    expect(model).toMatchObject(retrocycle);
  });

  it('should be able to decycle and retrocycle an array', () => {
    const model = makeCircularObject();

    const expected = [model, model];

    const decycle = CycleHelper.decycle(expected);
    const retrocycle = CycleHelper.retrocycle(decycle);

    expect(expected).toMatchObject(retrocycle);
  });
});
