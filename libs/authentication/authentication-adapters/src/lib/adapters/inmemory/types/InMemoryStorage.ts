import { StrongAuthVerifier, Invitation, User } from '@oney/authentication-core';

export interface InMemoryStorage {
  verifierMap: Map<string, StrongAuthVerifier>;
  userMap: Map<string, User>;
  invitationMap: Map<string, Invitation>;
}
