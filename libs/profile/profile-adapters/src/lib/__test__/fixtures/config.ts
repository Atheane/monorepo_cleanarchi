import { ProfileCoreConfiguration } from '@oney/profile-core';
import { ServiceName } from '@oney/identity-core';

const oneyB2CKey =
  'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLVxuTUlJSkp3SUJBQUtDQWdFQWxmRzNUNGUwdjFSMFhRSU5EemY4bDdtR3BhbVpBVmMrdGQzclhselBnUG9jR1ZwaVxuM080b0w2ajN5VnRZTGRoUUkxZHB3VGpvM3RQWUIxc09SbFBCbENQclVCVlhqV2phRTAwQ0dmTnVScFhabXhMSlxuTTFIeEpvVlJLVnhUWktnUFAyMUNhNlVNbWFQa1lCNDNNL3RZR3VBSTJkOXA2UjZGV0paekR1V09ydWlqZUNVdVxuRFJLcnBYOXFWQ1FiZWYwSWlmTlRLZ1V5eUl3M2xZU0hnTmJxZlNLODF3ZXpDdENpdUdWOFBvYlhIeXV4TUpxbFxuMmMrcFpONHdLVlNkNVBWRVhEeUw4ZjdwSGp1aVBWK3FDblZEZ0I5bW1QWTZnSUNLMTJZTG84RUhZVVNLbXFIR1xuUEpqcXFseHQ1MnJObnZlQ3NsQlBFbWFaNkJ6ZDJyYjJYc3liLzhnZzQ1dTFiUG9mYUxIZG11UURDVks0VUMzMFxuYUdDREUwdGlrZGtmRk9RQWhWMU9SOEtEU0I1a1NWcjNhVVdGMkVqVWtnU0hTTHlGT0hhSjhOYWFoM0YrZU1LSlxuZGFVTHcwczNobTJDcTFwWTBZaEhHb1V1Nzh5bnN0S20xOS9PcWJxOVhLK2FtRW1CbElOcHgvTWplRnp5NHhmb1xuUFpWWjFqNlQxSEFqTitVYkk1TlNHaW81b0RtMGRtK013UE12WGtRVWdCa0lFTm8xMC9sV1BlL3dlSW4yN3V4SVxuaE5Mc3NsQnVmWFdodjJ2clRQYXVmUzNubHQ0NXVoeDRTUjgrYzN5eEx2NS9JcGdlUmE4eCtqSEpoa2liMndlTlxuVnVUWnl5QkJIVmJIYWltQWx6QUJnbUc1VXh3TWVoVUxtLzJSMndqRWxIRUFsSXJsSGRUM25ITjEvRFVDQXdFQVxuQVFLQ0FnQjNtVyt2dmZ6THg5OXcrRnZXVWIvbWZaTUt2SFpRZlhpRnM5Y3pVekFvSGxjZldkc1ZnZGtIK3V4NVxuN2FRdUhTWCtxcEN1RUdpZW83YmlWeHpSdDZqbU1xaFZIbERSZUZySm5sa1l2ZlN0MUlUWGptcHh4dUJrNjEzTFxuY2RzS3BJcFUreDlKb1VLbG9mWmRQSHludDhtVTFqSDVKcHpoMXZoaHFzOW5pRzhBMElyaklEVFZOSms0enFMUFxuTG1YRUxiSUw1c3ZrN25TTlJscG5wbWcydWpZYlRnUDJPQ3YxYW1rQVQrS0VOU1dOdFZvRi9MUmhRYVJKMG5melxuMzR4NXZiQ2pLYUF1akRjQmFHdUdMTElDMlhuWHpqUVZ1Z0Q3MG92c04zYjlUTkJJSTFXeTlXcWJseFZHZ2FjZ1xuT1M1OXA4clYwL3plSG55UWljWGoyS0EzQ1ZrN3VhUFV3WWFnTk1RZ2dBMm5HYUM1SXdHK1kvS2RDb3A2d1BPSlxueGU4K1AvRFAxbzVTNWtDd3R0VEZJY3ZHZnh0dGh3U3ZyM0NZczZJdjJVc3gxdkc3NXpyNHNMcTM0ZVNRUmZUYVxubUdYTWxtMklZd3AwTWY5Mk1MWUc3cEpUMWY1S09BQkkvZ1dvQzJJYTFEQkFiWXBmNTZ6d3lZREJCOHRFNm11alxuenhyRHJFbUN2Sm8xTkNma1M3VzMveXd4RmdyZEtHWmhpVllJN0luekt5ZVJ0Vi9KY0Ntdk5VYnh6YnJjTTFxMFxuYVQwZTkrcURuRHhxZzBHZFc0MzZJMHRWTWhZT2x4YjM5SXZKYTh6QmVGUEoxUGRFa1JjWUFhZ1kxTkxBNTh6Rlxucy9pS1gvL0dRdG1qNXhBMUE5Nmt5dFV3eGp3RW1nTXZXZ3BzQS9UK1lxNkxuMmJQZ1FLQ0FRRUF4WXlNRWZRUVxuRmVpN0V2N1NnMHFIeWhZZXdmKzkxckNPaGI0R002MXhTVStZdVFyYmRYeEVaNXJJYTlHUEdKSWdsSklycnIvVVxualZrcWtLbkc3SkNISHdxS0h6bklUVkhyUVE0Qys0b1F6RzliSzVHR1NrRWQ1WXdjaGllMnRtaVRjb3pmakoxb1xuOGFOUGFTdGRMMFI4YmhHdXl5MkFNYWo1SEdhZXpxemh1cXorMno1UUg5ZWx4UUF5cVF5N2k3elZqOWY5KzlZM1xudWhDK1hyVDZMbWE3TjczYTJ2NCtUODNlUW9GSEp3Z216T1ltdkk0U1VUVDQ0QTh1Y2hUT1UwQlJEcm00R051ZFxubWxCNmJpb0tMMk9kUXpiUjBsWG5JK3hnSWFUZzcwQlU5b3lWVURxaVZnTUwxSkZPVWZNRytwL0hSbmRNbCtVOFxueGVWNkJvWm5sbStyQlFLQ0FRRUF3azlSWHVXOXVTbzVINWJpbDI4VkZIN083ZVVnanBXM3NsaVlWVEUxcko2bVxuR3J6Rk5BRWRDNGcwSDJHdEJ6bExnR3B5T1p2UEJJcTRtWTByUStMeVBocjFmRng1d0hkMHB1T1JZdkhBcE9zelxucUpMZTgxZWpwdTdPNWdlYXp2SVBVUStRZ2o5Z1NwRUhkRWVlODVPS0djYVNGeEZBblRGejhRM2lxdEt5QVFoZlxuZytDbklZcWRHeVNOQTc2VDNWV3o2VkMwZFpvMUxvSlpkd3J4ampvV0dXTzNsUzdHNEUxdVhjdnpkYVN4UDliYVxuVTFGcytETSs4MTIydWRqVFlhMDFhbUpPMlhtbDRpNng2UVZYV1JDTEZIRFZRUUk0YTNQVWJoenJTc29PWTZHZFxuUlhSYU9xK2xxenIrYlB1RGgvT2U0V3VSaVVYSVJ4Q3d4Q1RDTXV1emNRS0NBUUFoWlVRY21OekxSMSt3czJGVlxuRHBsc0FWZEx4bmNLUHlpbzFWbnBESTRWTFo2TTBaZ09BV2J5K01pZTZYcytWUjJxNEJjQVlLK0hBYWJmYzhRTVxuSTlhajJiMUYwQmZiY2xqSjA1dVBlR1NrbXNLWDErOFN5SFZNWStaQ2k1NG9zZjhUSTF0N1F2VUZ2R3psUTQ1cVxuT2pLcXpOUjJ4b2RnWGNkWEZNWU4vRTNncC9RaGppUXZiZDQ1TW5KZC82Z0kxSEJwODhLYyt6YktmcUFnRklvaVxuby8xTVRBMGVibEtNWFNvUXBoZ29NZ21WSStjeWd2WDN3bk84TlBUT0ZsUlc0STJUWnJRSGg4RFo0SGNCL3B0Z1xuTFgvZFovd0tpYmtjYW81SndiekExV2hIa2JhQUxKbGEzd0wxK1daN0ZoRjg5dHZTUHNLMC91ektLNlA0VEdwZ1xubFJvZEFvSUJBRXo2OTVYTkZ2a0F6VmpDZ2tyVWExbVBVNVBVTHEzT2l0UlJYU2lETW15TS9lbWgxODdla2c4N1xuaXNyVCs2VGRBaGlDRTNiWFQ1RFJGSWxnOEQ4WTdqZkVublVDZmduT1NaekVrNWpMaGpMUUs4c2hSTXJMY2I1MFxuNWVza0lDVFVxVlRJQWN4WUoySGpTenk2RXpNVXhLV3BrYjhweXB0OE9CN01EWHozdENYTWwycTcyZnJqMjVJaFxuVE95cTJCSGNIa2JVL21tSkNvQytpNHNwL3NFR0tqTXMybEowRWI1VGJ1SWlKdlg0cFhCUlFuVzMwS0FVVFdCRlxuUkZza2w3b2UwUWF3bytSczJWZGVnSVY4NURvWTM4RGRZdDg2YmZmRUQrai85QWZSUFJvanNSY1BIYUFhYmx3RVxuSjBBdDlOSXJwa3BRUDN4TzlTV1NheldLQ3BYNTQwRUNnZ0VBSDlWdU5DOEx2TjFvNDRZS3g1V0JwdTZqbWpFeVxuZi8zbjJ3d0l2YkRmL0xHYTdaRVM2akNNcE52OGlRVjBMZEJKY2k5bW9hSDVwL2dlejk2djE3SThuL0l6am4wK1xuNGNQV3E4NUVSU1NyZnlXZVZoYVlGcVpmeU9TT1ltcUJJS3FEWitvLzdhOGNobVVXWkFiV3g4MUpEQmxWMi9VdFxuaVZpSVRDaFZwYUJJemhSYjEyVDB0R3Z6azUyWldLU3dRQXJMMkFvZEZ3Q1dCRklkQkM1TEZkTkZnUWUwcEFLOFxuTWRFMlMxa1o5UVl4ajdZS0NNUCtxc245WElzMXg1SnNPTFRrMmkzV2JkTE1wUjNKVGhDTTRhT2pZUEgyNlFraVxuclRtekYvc3FnbzBZVTlBeVlOWGV0d09JSTFVb0F2WlB1ZEFkODFQc2FjS1ZyUzczWkwxai8wUDVpdz09XG4tLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQ==';

export const config: ProfileCoreConfiguration = {
  featureFlag: { profileStatusSaga: false },
  activateGenericOtp: true,
  providersConfig: {
    cdpConfig: {
      authToken: 'subscription-ke',
      baseUrl: 'https://lily-api.azure-api.net/recommendations',
      timeout: 2500,
    },
    odbPaymentConfig: {
      baseUrl: 'http://localhost:3022/payment',
      token: 'bWFsYWlrYTpzdXBlcnNlY3JldA==',
    },
    oneytrustConfig: {
      otBaseUrl: 'https://pad-staging.api-ot.com/api/v2',
      secretKey: 'qnGEboiJ93jw0uwuOYof6rWDgNKmRP',
      entityReference: 3000001341,
      login: 'api-3000001341-1@oneytrust.com',
      oneyTrustFolderBaseApi: 'https://api-staging.oneytrust.com',
      caseType: 60,
      language: 'FR',
      flagCallbackUrlInPayload: true,
      callbackDecisionUrl: 'https://callback-azf-url.fr',
    },
    oneyB2CConfig: {
      OdbOneyB2CApiXAuthAuthor: 'e5f452048da84b34b5701bfcd45c3f8b',
      odbOneyB2CApiClientId: 'PTAIL_BQ_DIGIT',
      baseUrl: 'https://api-staging.oney.io',
      apiVersion: 'v1',
      odbOneyB2CKeyId: '5c8090fa-d768-48ce-835d-29d6faab5dbe',
      tokenExpiration: '30d',
      odbOneyB2CApiClientSecret: '426ba2d4-c2df-4cb1-a6d4-c8c858964718',
      OdbOneyB2CApiXAuthAuthent: 'a276ae50ae6f4526b54f019e33f4f1e0',
      odbOneyB2CKey: oneyB2CKey,
      featureFlagContract: true,
    },
    oneyFccFicp: {
      oneyFccFicpApiXAuthAuthent: '8dc48069267c41b0bb416ac924f64b2e',
      partnerGuid: 'e2d564e96a1b4bb5a8bef41c48a6bf88',
      secretKey: 'CfpCsWdn/sUEDT8gkMjiWilVShZSKhnVs04PhM8ENK8=',
      apiKey: 'X-oney-authorization',
      baseUrl: 'https://api-staging.fr.oney.io/',
    },
  },
  inMemoryMode: true,
  mongoUrl: process.env.MONGO_URL,
  mongoCollection: 'test',
  serviceBusUrl: 'test',
  serviceBusSub: 'test',
  serviceBusTopic: 'odb_profile_topic',
  serviceBusProfileAzfTopic: 'odb_profile-azf_topic-kyc_decision',
  topicPaymentAzfEkyc: 'ekyazftopic',
  odbPaymentTopic: 'odb_payment_topic',
  otpExpirationTime: 60,
  otpMaxAttempts: 5,
  otpLockDuration: 24,
  topicOdbAggregation: 'odb_aggregation_topic',
  odbProfileBlobStorageCs:
    'DefaultEndpointsProtocol=https;AccountName=odb0storage0dev;AccountKey=wiS0upEBf91Dxz2Q7D0TUMYu+3nG0EwN3UgVPXi5gC5LAahZZPKjlYqq/i0w04/L2saKNRZBr6FnrQdxaLIx8Q==;EndpointSuffix=core.windows.net',
  blobStorageContainerName: 'documents',
  odbContractPath: '/contract/contract.pdf',
  odbCdpTopic: 'odb_cdp_topic',
  customerServiceTopicsVersion: '20210326',
  otpDbConfig: {
    dbMongoUrl: process.env.MONGO_URL,
    dbMongoCollection: 'test',
  },
  frontDoorApiBaseUrl: 'http://localhost:3022',
  documentGeneratorApiUrl: 'https://odb-docgen-functions-w.azurewebsites.net/api/ExportPdf',
};

export const identityConfig = {
  serviceName: ServiceName.profile,
  secret: 'weshpoto',
  azureTenantId: '',
  jwtOptions: {},
  applicationId: null,
  azureClientIds: {
    pp_de_reve: null,
    oney_compta: null,
  },
};
