export interface GuardGateway {
  checkUserId(userId: string, userToken: string): boolean;
}
