import {
  GetAccountsByConnectionId,
  AggregateAccounts,
  SaveUserConsent,
  BankConnection,
} from '@oney/aggregation-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { Container } from 'inversify';

export const testConnector = {
  uid: '338178e6-3d01-564f-9a7b-52ca442459bf',
  logo: 'https://fake-test-storage.onbadi.com/logo-bank/338178e6-3d01-564f-9a7b-52ca442459bf.png',
  name: 'Connecteur de test',
  code: '00000',
};

export async function getUserToken(container: Container, userId: string) {
  const encodeIdentity = container.get(EncodeIdentity);
  return encodeIdentity.execute({
    provider: IdentityProvider.odb,
    email: 'azeae',
    uid: userId,
  });
}

export async function createUser(container: Container, userId: string) {
  return container.get(SaveUserConsent).execute({
    userId,
    consent: true,
  });
}

export enum stateCase {
  VALID = 'par',
  SCA = 'SCARequired',
  SCA_THEN_OTP = 'SCARequiredAndOTP',
  SCA_THEN_DECOUPLED = 'SCARequiredAndDecoupled',
  ACTION_NEEDED = 'actionNeeded',
  OTP = 'additionalInformationNeeded',
  BUG = 'bug',
  DECOUPLED = 'shortDecoupled',
  WRONG_PASSWORD = 'wrongpass',
  PASSWORD_EXPIRED = 'passwordExpired',
}

export const payloadSignIn = (userId: string, stateCase: stateCase) => ({
  userId,
  bankId: '338178e6-3d01-564f-9a7b-52ca442459bf',
  form: [
    {
      name: 'openapiwebsite',
      value: stateCase,
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
});

export async function aggregateAccounts(container: Container, userId: string, connection: BankConnection) {
  const getAccounts = container.get(GetAccountsByConnectionId);
  const aggregateAccounts = container.get(AggregateAccounts);

  const { bankAccounts: accounts } = await getAccounts.execute({
    userId,
    connectionId: connection.props.connectionId,
  });

  const bankAccounts = await aggregateAccounts.execute({
    connectionId: connection.props.connectionId,
    accounts: [
      {
        id: accounts[0].props.id,
        name: 'my account',
        aggregated: true,
      },
    ],
    userId,
  });

  return { bankAccounts, bankConnection: connection };
}
