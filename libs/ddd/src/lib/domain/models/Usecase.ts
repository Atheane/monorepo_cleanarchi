import { Dictionary } from '@oney/common-core';
import { CanExecuteResult, Identity } from '@oney/identity-core';

export interface Usecase<IRequest, IResponse> {
  execute(request?: IRequest, identity?: Identity): Promise<IResponse> | IResponse;
  canExecute?(
    identity: Identity,
    request?: IRequest,
    metadatas?: Dictionary<Record<string, string>>,
  ): Promise<boolean | CanExecuteResult> | boolean;
}
