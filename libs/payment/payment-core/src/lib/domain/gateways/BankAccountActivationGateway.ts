export interface BankAccountActivationGateway {
  createComplimentaryDiligence(userId: string): Promise<void>;
}
