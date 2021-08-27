import { AuthIdentifier, Email, User, UserRepository } from '@oney/authentication-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { Container } from 'inversify';

export const user = new User({
  email: Email.from('hello@hello.com'),
  uid: '123456',
  pinCode: null,
  phone: null,
});

export async function getUserToken(container: Container) {
  const encodeIdentity = container.get(EncodeIdentity);
  const userRepository = container.get<UserRepository>(AuthIdentifier.userRepository);
  const registerUser = await userRepository.save(user);
  const { uid, email } = registerUser.props;
  const command = { uid, email: email.address, provider: IdentityProvider.odb };
  return await encodeIdentity.execute(command);
}

export const userWithPhone = new User({
  email: Email.from('test123testss@yopmail.com'),
  uid: '12869@QPA_USER_TEST_003',
  pinCode: null,
  phone: '0612345678',
});

export async function getUserWithPhoneToken(container: Container) {
  const encodeIdentity = container.get(EncodeIdentity);
  const userRepository = container.get<UserRepository>(AuthIdentifier.userRepository);
  const registerUser = await userRepository.save(userWithPhone);
  const { uid, email } = registerUser.props;
  const command = { uid, email: email.address, provider: IdentityProvider.odb };
  return await encodeIdentity.execute(command);
}
