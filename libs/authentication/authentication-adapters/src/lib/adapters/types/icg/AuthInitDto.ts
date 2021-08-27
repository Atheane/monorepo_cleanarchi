export interface AuthInitDto<M> {
  responseId: string;
  id: string;
  method: M;
  retries?: number;
  unblockingDate?: Date;
}
