import { IHttpBuilder } from '@oney/http';
import { UpdateUserRequest } from '../models/updateUser/UpdateUserRequest';

export class UserApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async updateUser(request: UpdateUserRequest): Promise<void> {
    const { fiscalReference, phone, uid, declarativeFiscalSituation } = request;
    await this._http.patch(`/user/${uid}`, { phone, fiscalReference, declarativeFiscalSituation }).execute();
  }
}
