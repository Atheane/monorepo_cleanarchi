import { TransactionError } from '../../models/PfmErrors';
import {
  FieldEnum,
  OrderEnum,
  TransactionQueryType,
  ValidTransactionQueryKeys,
} from '../../types/TransactionQuery';

export class TransactionQuery {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  constructor(private readonly query: any) {
    this.query = query;
  }

  async validate(): Promise<TransactionQueryType> {
    if (!this.query || !Object.keys(this.query).length) {
      return null;
    }
    const queryKeys = Object.keys(this.query).sort();
    if (JSON.stringify(queryKeys) !== JSON.stringify(ValidTransactionQueryKeys)) {
      throw new TransactionError.InvalidQuery(
        'Wrong query params keys were provided, it should be sortBy, dateFrom and dateTo',
      );
    } else {
      const [fieldName, fieldValue] = this.query.sortBy.split(';');
      if (!Object.values(FieldEnum).includes(FieldEnum[fieldName])) {
        throw new TransactionError.InvalidQuery(
          'Wrong query params values were provided for sortBy: sortBy should be date;ASC or date;DESC',
        );
      } else if (!Object.values(OrderEnum).includes(OrderEnum[fieldValue])) {
        throw new TransactionError.InvalidQuery(
          'Wrong query params values were provided for sortBy: sortBy should be date;ASC or date;DESC',
        );
      } else if (this.query.dateFrom > this.query.dateTo) {
        throw new TransactionError.InvalidQuery(
          'Wrong query params values were provided: dateTo should be later than dateFrom',
        );
      } else if (this.query.dateFrom < new Date('2019-01-01').getTime()) {
        throw new TransactionError.InvalidQuery(
          'Wrong query params values were provided: dateFrom should be after 2019-01-01',
        );
      } else {
        return {
          ...this.query,
          sortBy: OrderEnum[fieldValue],
        };
      }
    }
  }
}
