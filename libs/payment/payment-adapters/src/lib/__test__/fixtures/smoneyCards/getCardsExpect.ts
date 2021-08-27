export const expectedErrorUpdateCard = {
  message: 'Request failed with status code 404',
  config: {
    url: 'users/zCDOH_UvA/cards/card-BjHjzuN5V',
    headers: undefined,
    method: 'put',
    httpVersion: undefined,
    originalUrl: undefined,
    query: undefined,
    data: undefined,
    params: undefined,
  },
  apiErrorReason: {
    Code: 1066,
    ErrorMessage: 'Incorrect limit value',
    Title: 'Operation cannot be completed',
    Priority: 2,
  },
  status: 404,
};

export const expectedErrorCreationCard = {
  cause: {
    message: 'Request failed with status code 400',
    config: {
      url: 'users/zCDOH_UvA/cards',
      headers: undefined,
      method: 'post',
      httpVersion: undefined,
      originalUrl: undefined,
      query: undefined,
      data: undefined,
      params: undefined,
    },
    apiErrorReason: {
      Code: 717,
      ErrorMessage: 'The AppCardId used to create the card already exist',
      Title: 'Operation cannot be completed',
      Priority: 2,
    },
    status: 400,
  },
  safeMessage: undefined,
};
