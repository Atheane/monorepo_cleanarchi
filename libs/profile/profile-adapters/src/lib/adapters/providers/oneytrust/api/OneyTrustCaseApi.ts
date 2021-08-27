import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import { OneyTrustCheckSumGenerator } from '../OneyTrustCheckSumGenerator';
import { UpdateOneyTrustCaseRequest } from '../models/caseApi/UpdateOneyTrustCaseRequest';
import { OneyTrustEventRequest } from '../models/caseApi/OneyTrustEventRequest';
import { OneyTrustEventResponse } from '../models/caseApi/OneyTrustEventResponse';
import { OneyTrustNewCaseRequest } from '../models/caseApi/OneyTrustNewCaseRequest';
import { OneyTrustNewCaseResponse } from '../models/caseApi/OneyTrustNewCaseResponse';

export class OneyTrustCaseApi {
  constructor(
    private readonly _oneyTrustCheckSumGenerator: OneyTrustCheckSumGenerator,
    private readonly _entityReference: number,
    private readonly _login: string,
    private readonly _oneyTrustFolderApiBaseUrl: string,
  ) {}

  async updateFolder(request: UpdateOneyTrustCaseRequest, newKyc = false): Promise<void> {
    // Must be in order as follow
    const checksumPayload = {
      entityReference: this._entityReference,
      caseReference: request.caseReference,
      gender: request.gender,
      birthName: !request.birthName ? '' : request.birthName,
      familyName: !request.familyName ? '' : request.familyName,
      givenNames: !request.givenNames ? '' : request.givenNames,
      birthDate: request.birthDate,
      streetName1: !request.address.streetName1 ? '' : request.address.streetName1,
      streetName2: !request.address.streetName2 ? '' : request.address.streetName2,
      postCode: !request.address.postCode ? '' : request.address.postCode,
      locality: !request.address.locality ? '' : request.address.locality,
    };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateTulipeChecksum(checksumPayload);
    const updateHttpClient = await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderApiBaseUrl)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-type': 'application/json',
      });
    if (newKyc) {
      await updateHttpClient
        .post(`/tulipe/v2/${this._entityReference}/cases/${request.caseReference}/form-data`, {
          login: this._login,
          customerRank: 0,
          ...request,
        })
        .execute();
    } else {
      await updateHttpClient
        .patch(`/tulipe/v2/${this._entityReference}/cases/${request.caseReference}/form-data`, {
          login: this._login,
          customerRank: 0,
          ...request,
        })
        .execute();
    }
    return;
  }

  async createCase(request: OneyTrustNewCaseRequest): Promise<OneyTrustNewCaseResponse> {
    // Must be in order as follow
    const checksumPayload = {
      entityReference: this._entityReference,
      caseReference: request.caseReference,
      caseType: request.caseType,
    };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateTulipeChecksum(checksumPayload);
    const { data } = await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderApiBaseUrl)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-type': 'application/json',
      })
      .post(`/tulipe/v2/${this._entityReference}/cases`, {
        login: this._login,
        ...request,
      })
      .execute();
    return data as OneyTrustNewCaseResponse;
  }

  async askForDecision(caseReference: string): Promise<void> {
    // Must be in order as follow
    const checksumPayload = {
      entityReference: this._entityReference,
      caseReference,
    };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateTulipeChecksum(checksumPayload);
    await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderApiBaseUrl)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-type': 'application/json',
      })
      .post(`/tulipe/v2/${this._entityReference}/cases/${caseReference}/analysis`, {
        login: this._login,
      })
      .execute();
    return;
  }

  async customerCaseEvents(request: OneyTrustEventRequest): Promise<OneyTrustEventResponse> {
    // Must be in order as follow
    const checksumPayload = {
      entityReference: this._entityReference,
      eventReference: request.eventReference,
      eventType: request.eventType,
    };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateTulipeChecksum(checksumPayload);
    const { data } = await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderApiBaseUrl)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-type': 'application/json',
      })
      .post<OneyTrustEventResponse>(`/tulipe/v2/${this._entityReference}/events`, {
        login: this._login,
        ...request,
      })
      .execute();
    return data;
  }
}
