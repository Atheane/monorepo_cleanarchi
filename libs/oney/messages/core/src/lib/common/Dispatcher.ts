import { injectable } from 'inversify';

@injectable()
export abstract class Dispatcher<TSent, TOptions> {
  dispatch(...inputs: TSent[]): MessageDispatcherPromise<TSent, TOptions> {
    return new MessageDispatcherPromise(this, inputs);
  }

  /** @internal */ abstract doDispatch(messages: TSent[], options?: TOptions): Promise<void>;
}

export class MessageDispatcherPromise<TSent, TOptions> implements PromiseLike<void> {
  private readonly _dispatcher: Dispatcher<TSent, TOptions>;
  private readonly _inputs: TSent[];

  constructor(dispatcher: Dispatcher<TSent, TOptions>, inputs: TSent[]) {
    this._dispatcher = dispatcher;
    this._inputs = inputs;
  }

  private _options?: TOptions;
  configure(options: TOptions): this {
    this._options = options;
    return this;
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.getInnerPromise().then(onfulfilled, onrejected);
  }

  private _innerPromise: Promise<void>;
  private getInnerPromise(): Promise<void> {
    if (!this._innerPromise) {
      this._innerPromise = this._dispatcher.doDispatch(this._inputs, this._options);
    }

    return this._innerPromise;
  }
}
