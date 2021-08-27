# oney-messages-adapters

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test oney-messages-adapters` to execute the unit tests via [Jest](https://jestjs.io).


## Commands

#### Command sample

```typescript
import { Command, DecoratedCommand } from '@oney/messages-core';

@DecoratedCommand({ namespace: '@oney/test', name: 'sample-command', version: 0 })
export class SampleCommand implements Command {
  public id: string;
  public props: any;
}
```

#### Handler sample

```typescript
import { Command, CommandHandler, CommandReceiveContext } from '@oney/messages-core';

export class SampleCommandHandler implements CommandHandler {
  public handle(command: Command, ctx: CommandReceiveContext): Promise<void> {
    return Promise.resolve();
  }
}
```

### Setup handlers

```typescript
const container = new Container();
configureAzureCommandServiceBus(container, { connectionString }, (r) => {
  r.register(SampleCommand, SampleCommandHandler);
});
```

### Dispatch commands

```typescript
const dispatcher = container.get(CommandDispatcher);

const command = new SampleCommand();

await dispatcher.dispatch(command);
```

### Azure service bus message body type 

```typescript
export interface CommandMessageBody<TCommand extends Command = Command> {
  id: string;
  name: string;
  namespace: string;
  version: number;
  timestamp: number;
  context: OneyExecutionContext;
  payload: TCommand;
}
```
