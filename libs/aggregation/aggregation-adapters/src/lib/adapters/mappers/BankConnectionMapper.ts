import { AggregationIdentifier, BankField, IBankField, BankConnection } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { inject, injectable } from 'inversify';
import { ConnectionStateMapper } from './ConnectionStateMapper';
import { BIConnectionBoosted } from '../partners/budgetinsights/models/Connection';

@injectable()
export class BankConnectionMapper implements Mapper<BankConnection> {
  constructor(
    @inject(AggregationIdentifier.connectionStateMapper)
    private readonly connectionStateMapper: ConnectionStateMapper,
  ) {}

  toDomain(raw: BIConnectionBoosted): BankConnection {
    const { connectionId, userId, connection } = raw;

    const mappedFields: BankField[] = connection.fields
      ? connection.fields.map(
          field =>
            new BankField({
              validation: field.regex ? new RegExp(field.regex) : null,
              type: IBankField[field.type.toUpperCase()],
              name: field.name,
              label: field.label,
            }),
        )
      : null;

    const bankConnection = new BankConnection({
      connectionId,
      userId,
      state: this.connectionStateMapper.toDomain(connection.state),
      bankId: connection.connector_uuid,
      active: connection.active,
      form: mappedFields,
      refId: connection.id.toString(),
      connectionDate: new Date(connection.created),
    });

    return bankConnection;
  }
}
