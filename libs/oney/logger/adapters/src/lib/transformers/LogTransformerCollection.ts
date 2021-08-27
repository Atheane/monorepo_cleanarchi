import { Log, LogTransformer } from '@oney/logger-core';
import { Bad, Ok } from '@oney/result';

export class LogTransformerCollection extends LogTransformer {
  private readonly _transformers: LogTransformer[];

  constructor() {
    super();
    this._transformers = [];
  }

  get transformers() {
    return this._transformers;
  }

  register(transformer: LogTransformer) {
    if (this._transformers.indexOf(transformer) > -1) {
      return Bad('TRANSFORMER_ALREADY_REGISTERED');
    }

    this._transformers.push(transformer);

    return Ok();
  }

  unregister(transformer: LogTransformer) {
    const index = this._transformers.indexOf(transformer);

    if (index === -1) {
      return Bad('TRANSFORMER_NOT_FOUND');
    }

    this._transformers.splice(index, 1);

    return Ok();
  }

  public transforms(log: Log): Log {
    let tmpLog = log;

    this._transformers.forEach(x => {
      tmpLog = x.transforms(tmpLog);
    });

    return tmpLog;
  }
}
