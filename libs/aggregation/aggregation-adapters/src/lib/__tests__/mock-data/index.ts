export const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };
export const fakeConnectionBank = {
  bankId: testConnector.uuid,
  userId: 'user3',
  form: [
    {
      name: 'openapiwebsite',
      value: 'par',
    },
    {
      name: 'login',
      value: 'Identifiant',
    },
    {
      name: 'password',
      value: '1234',
    },
  ],
};
export const fakeBankAccountOwner = { userId: 'user2', consent: true, credential: 'credentialForTestFake' };
