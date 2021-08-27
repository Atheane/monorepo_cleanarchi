export enum OrderEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}
export type TransactionQueryType = {
  sortBy: OrderEnum;
  dateFrom: number;
  dateTo: number;
};

enum TransactionQueryKeys {
  SORT_BY = 'sortBy',
  DATE_FROM = 'dateFrom',
  DATE_TO = 'dateTo',
}

export const ValidTransactionQueryKeys = [
  TransactionQueryKeys.SORT_BY,
  TransactionQueryKeys.DATE_FROM,
  TransactionQueryKeys.DATE_TO,
].sort();

export enum FieldEnum {
  date = 'date',
}
