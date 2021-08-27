import { IHttpBuilder } from '@oney/http';
import { OneyB2CAuthenticationApi } from './OneyB2CAuthenticationApi';
import { CreateCustomerRequest } from '../models/CreateCustomerRequest';
import { GetCustomerRequest } from '../models/GetCustomerRequest';
import { GetCustomerResponse } from '../models/GetCustomerResponse';

export class OneyB2CCustomerApi {
  constructor(
    private readonly _http: IHttpBuilder,
    private readonly _oneyB2CAuthentication: OneyB2CAuthenticationApi,
  ) {}

  async create(request: CreateCustomerRequest): Promise<void> {
    const getToken = await this._oneyB2CAuthentication.getToken(request.emails[0].address);
    await this._http
      .setAdditionnalHeaders({
        Authorization: `Bearer ${getToken}`,
      })
      .post('/b2c/customers/v2/customers', {
        customer: request,
      })
      .execute();
    return;
  }

  async update(request: CreateCustomerRequest): Promise<void> {
    const getToken = await this._oneyB2CAuthentication.getToken(request.emails[0].address);
    await this._http
      .setAdditionnalHeaders({
        Authorization: `Bearer ${getToken}`,
      })
      .put('/b2c/customers/v2/customers', {
        customer: request,
      })
      .execute();
    return;
  }

  async get(request: GetCustomerRequest): Promise<GetCustomerResponse> {
    const getToken = await this._oneyB2CAuthentication.getToken(request.emailAddress);
    const { data } = await this._http
      .setAdditionnalHeaders({
        Authorization: `Bearer ${getToken}`,
      })
      .get<GetCustomerResponse>('/b2c/customers/v2/customers')
      .execute();
    return data;
  }
}
