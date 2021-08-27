import {
  SignIn,
  GetAccountsByConnectionId,
  AggregateAccounts,
  GetConnectionsOwnedByUser,
  SynchronizeConnection,
  SaveUserConsent,
  User,
  BankAccount,
  BankConnection,
} from '@oney/aggregation-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { Container } from 'inversify';
import { SignInCommand } from '../../modules/auth/commands';

export const testConnector = {
  uid: '338178e6-3d01-564f-9a7b-52ca442459bf',
  logo: 'https://fake-test-storage.onbadi.com/logo-bank/338178e6-3d01-564f-9a7b-52ca442459bf.png',
  name: 'Connecteur de test',
  code: '00000',
};

export async function getUserToken(container: Container, userId: string): Promise<string> {
  const encodeIdentity = container.get(EncodeIdentity);
  return encodeIdentity.execute({
    provider: IdentityProvider.odb,
    email: 'azeae',
    uid: userId,
  });
}

export async function createUser(container: Container, userId: string): Promise<User> {
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

export const payloadSignIn = (userId: string, stateCase: stateCase): SignInCommand => ({
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

export async function getAccounts(
  container: Container,
  userId: string,
): Promise<{ bankAccounts: BankAccount[]; bankConnection: BankConnection }> {
  const signIn = container.get(SignIn);
  const getAccounts = container.get(GetAccountsByConnectionId);
  const bankConnection = await signIn.execute(payloadSignIn(userId, stateCase.VALID));
  const { bankAccounts } = await getAccounts.execute({
    userId,
    connectionId: bankConnection.props.connectionId,
  });
  return {
    bankAccounts,
    bankConnection,
  };
}

export async function getAggregatedAccounts(
  container: Container,
  userId: string,
): Promise<{ aggregatedAccounts: BankAccount[]; connection: BankConnection }> {
  const signIn = container.get(SignIn);
  const getAccounts = container.get(GetAccountsByConnectionId);
  const aggregateAccounts = container.get(AggregateAccounts);
  const connection = await signIn.execute(payloadSignIn(userId, stateCase.VALID));

  const { bankAccounts } = await getAccounts.execute({
    userId,
    connectionId: connection.props.connectionId,
  });

  const aggregatedAccounts = await aggregateAccounts.execute({
    connectionId: connection.props.connectionId,
    accounts: [
      {
        id: bankAccounts[0].props.id,
        name: 'my account',
        aggregated: true,
      },
    ],
    userId,
  });
  return {
    connection,
    aggregatedAccounts,
  };
}

export async function getConnectionScaRequired(
  container: Container,
  userId: string,
): Promise<{ synchronizedConnection: BankConnection; updatedConnections: BankConnection[] }> {
  const signIn = container.get(SignIn);
  const getAccounts = container.get(GetAccountsByConnectionId);
  const aggregateAccounts = container.get(AggregateAccounts);
  const getConnections = container.get(GetConnectionsOwnedByUser);
  const syncConnection = container.get(SynchronizeConnection);

  const connection = await signIn.execute(payloadSignIn(userId, stateCase.SCA_THEN_OTP));
  const { bankAccounts } = await getAccounts.execute({
    userId,
    connectionId: connection.props.connectionId,
  });

  await aggregateAccounts.execute({
    connectionId: connection.props.connectionId,
    accounts: [
      {
        id: bankAccounts[0].props.id,
        name: 'my account',
        aggregated: true,
      },
    ],
    userId,
  });

  const { bankConnections: updatedConnections } = await getConnections.execute({
    userId,
  });

  //update data locally
  const synchronizedConnection = await syncConnection.execute({
    refId: connection.props.refId,
    state: 'SCARequired',
    active: true,
  });

  // now connection should be sync to SCARequired
  return { synchronizedConnection, updatedConnections };
}

export async function getConnectionPasswordExpired(
  container: Container,
  userId: string,
): Promise<BankConnection> {
  const signIn = container.get(SignIn);
  const syncConnection = container.get(SynchronizeConnection);
  const connection = await signIn.execute(payloadSignIn(userId, stateCase.VALID));

  //update data locally
  const synchronizedConnection = await syncConnection.execute({
    refId: connection.props.refId,
    state: 'passwordExpired',
    active: true,
  });

  return synchronizedConnection;
}
