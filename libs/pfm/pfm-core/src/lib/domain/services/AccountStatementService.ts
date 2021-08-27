export interface AccountStatementService {
  getAccountStatement(file: string): Promise<Buffer>;
}
