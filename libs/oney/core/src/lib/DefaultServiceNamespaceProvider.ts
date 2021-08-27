import { ServiceNamespaceProvider } from './ServiceNamespaceProvider';

export class DefaultServiceNamespaceProvider extends ServiceNamespaceProvider {
  private _namespace: string;

  constructor(namespace: string) {
    super();
    this._namespace = namespace;
  }

  public getNamespace(): string {
    return this._namespace;
  }
}
