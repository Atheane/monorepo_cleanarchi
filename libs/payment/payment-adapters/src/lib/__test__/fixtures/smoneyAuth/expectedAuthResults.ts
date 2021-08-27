export const functionnalError = {
  cause: {
    message: 'Request failed with status code 404',
    config: {
      url: 'users/UserIdTest/bankaccounts/56',
      headers: {
        Accept: 'application/json, text/plain, */*',
        // eslint-disable-next-line max-len
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc4Q0QwNDc2MDM2RUQxMDAwMEQzNjRFNEJCQzQ2RjE2NzFFNkIzNDJSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6ImVNMEVkZ051MFFBQTAyVGt1OFJ2Rm5IbXMwSSJ9.eyJuYmYiOjE2MDc0NTM5NjEsImV4cCI6MTYwNzQ1NzU2MSwiaXNzIjoiaHR0cHM6Ly9zYi1jb25uZWN0Lnhwb2xsZW5zLmNvbSIsImF1ZCI6IkFQSS5HYXRld2F5IiwiY2xpZW50X2lkIjoiT25leS5UZXN0IiwicGFydG5lcl9jb2RlIjoib25leSIsImp0aSI6IjRENDAyQTVBNzlBMDM2QzJCODFBODFCNDA2NzlBRDE3IiwiaWF0IjoxNjA3NDUzOTYxLCJzY29wZSI6WyJwYXJ0bmVyIl19.U4O7xJgD9ufBpuYrfen_ZQFtVDxhS6NMm0spctPFQqQP9SEUKNyaxL7qb6sXTp-dh674kqzuWlpMEfe4dAET6m3KHS0ZMsRTz5CxV5Juzfmvv8jaTaklos7komvEBLJNWxQIu6tw1EC0ldGYuphwDAsNsFYwoM78e8fKVejB2Y6bCgUVGwPcHGfd_iEdrHTzAjv-AcCWUcsIz7fXDU6Pbo1yO4XgInrIXC-raB1Q3dKg0EkMKvT1hUpdXu9q3CKoY9xlde7C0jLqQqNl4oaL7_KHyLFOSy5BwFPAd4eDPN0RIsVoiGdTxwhKYkOO6ZZlvU3jaHRC35RacP2K-qJvxA',
        'User-Agent': 'axios/0.19.2',
      },
      method: 'get',
      httpVersion: undefined,
      originalUrl: undefined,
      query: undefined,
      data: undefined,
      params: undefined,
    },
    apiErrorReason: {
      Code: 147,
      ErrorMessage: 'Votre saisie ne correspond pas à un utilisateur S-money',
      Title: "L'opération ne peut pas aboutir",
      Priority: 2,
    },
    status: 404,
  },
  safeMessage: undefined,
};

export const invalidClientError = {
  cause: {
    message: 'Request failed with status code 400',
    config: {
      url: 'connect/token',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'axios/0.19.2',
        'Content-Length': 91,
      },
      method: 'post',
      httpVersion: undefined,
      originalUrl: undefined,
      query: undefined,
      data: undefined,
      params: undefined,
    },
    apiErrorReason: { error: 'invalid_client' },
    status: 400,
  },
  safeMessage: undefined,
};
