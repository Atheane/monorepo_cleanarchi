# oney-mongoose

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test oney-mongoose` to execute the unit tests via [Jest](https://jestjs.io).


## Optimistic concurrency 

### Create Model

```typescript
const factory = new MongooseSchemaFactory(connection);

const userModel = factory.create<UserDoc>('Users', {
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  },
  avatar: {
    type: String,
  },
});
```

this factory enables by default the following options:
```typescript
const defaultOptions: SchemaOptions = {
  optimisticConcurrency: true,
  minimize: false,
  strict: 'throw',
  strictQuery: true,
  useNestedStrict: true,
  emitIndexErrors: true,
  typePojoToMixed: false,
};
```

### Use tooling

#### RetryConcurrencyStrategy
```typescript
const shouldRetry = () => Boolean;
const strategy = new RetryConcurrencyStrategy(shouldRetry);
await strategy.execute(() => {
  // your code
});
```

#### NbRetryConcurrencyStrategy
```typescript
const strategy = new NbRetryConcurrencyStrategy(2);
await strategy.execute(() => {
  // your code
});
```


#### Make your custom strategy 

```typescript
export class CustomConcurrencyStrategy extends ConcurrencyStrategy {
  protected async onVersionError<T>(cb: () => AsyncOrSync<T>, error: Error.VersionError): Promise<void> {
    // your strategy
  }
}
```
