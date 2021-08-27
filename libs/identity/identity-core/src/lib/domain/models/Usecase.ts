import { Dictionary } from '@oney/common-core';
import { CanExecuteResult } from '@oney/identity-core';
import { Identity } from '../entities/Identity';

// Specific case here for prevent circular dep with identity import in ddd and usecase import in identity.
// Affect only this lib.
export interface Usecase<IRequest, IResponse> {
  execute(request?: IRequest, identity?: Identity): Promise<IResponse> | IResponse;
  canExecute?(
    identity: Identity,
    request?: IRequest,
    metadatas?: Dictionary<Record<string, string>>,
  ): Promise<boolean | CanExecuteResult>;
}
