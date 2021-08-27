# oney-messages-core

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test oney-messages-core` to execute the unit tests via [Jest](https://jestjs.io).


## Messages Dispatcher

### Use custom mapper

From dispatch call:
```typescript
dispatcher.dispatch(yourEvent).configure({
  customMapper: new CustomMapper(),
});
```

### Use custom serializer

From dispatch call:
```typescript
dispatcher.dispatch(yourEvent).configure({
  customSerialize: new CustomSerializer(),
});
```


### Custom serializer sample

```typescript
export class ChoucrouteEventMessageBodySerializer extends EventMessageBodySerializer {
  public deserialize(messageBody: string | Buffer): EventMessageBody {
    return {};
  }

  public serialize(messageBody: EventMessageBody): string | Buffer {
    return 'choucroute';
  }
}
```


## Commands Dispatcher

### scheduledEnqueueTimeUtc option

From dispatch call:
```typescript
commandDispatcher.dispatch(yourCommand).configure({
  scheduledEnqueueTimeUtc: new Date(Date.now() + 60 * 1000), // in 60 sec
});
```
