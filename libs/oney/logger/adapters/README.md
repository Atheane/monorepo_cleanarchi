# logger-adapters

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test logger-adapters` to execute the unit tests via [Jest](https://jestjs.io).


### Simple setup

```typescript
import { Container } from 'inversify';
import { configureLogger } from '@oney/logger-adapters';

const container = new Container();
configureLogger(container);
```

### Usage

#### Default logger

It's a const value accessible from anywhere.
Some side effect come from a const value usage was managed.

```typescript
import { defaultLogger } from '@oney/logger-adapters';

defaultLogger.trace('@oney/logger.trace', metadata);
defaultLogger.debug('@oney/logger.debug', metadata);
defaultLogger.info('@oney/logger.info', metadata);
defaultLogger.warn('@oney/logger.warn', metadata);
defaultLogger.error('@oney/logger.error', metadata);
defaultLogger.fatal('@oney/logger.fatal', metadata);
```

#### From injection 

```typescript
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class SampleService {
  private readonly _logger: Logger

  constructor(@inject(SymLogger) logger: Logger) {
    this._logger = logger;
  }
}

```

### Interfaces

#### Logger 

```typescript
import { OneySymbol } from '@oney/core';

export const SymLogger = OneySymbol('Logger');

export interface Logger {
  trace(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  fatal(message: string, meta?: any): void;
}
```
