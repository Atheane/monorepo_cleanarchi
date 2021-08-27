import { injectable } from 'inversify';
import { Mapper } from '@oney/common-core';
import { Bank, BankCode, BankField, IBankField, IBudgetInsightConfiguration } from '@oney/aggregation-core';
import { bankCodes } from '../partners/budgetinsights/models/BankCodes';
import { FieldLabel } from '../partners/budgetinsights/models/BudgetInsightAccount';
import { BIConnector } from '../partners/budgetinsights/models/Connector';
import { featuredBanks } from '../partners/budgetinsights/models/FeaturedBanks';

@injectable()
export class BankMapper implements Mapper<Bank> {
  constructor(
    private budgetInsightConfiguration: IBudgetInsightConfiguration,
    private blobStorageEndpoint: string,
  ) {}

  toDomain(raw: BIConnector): Bank {
    try {
      const rawCopy = { ...raw };
      if (rawCopy.id === parseInt(this.budgetInsightConfiguration.testConnectorId, 10)) {
        const TEST_CONNECTOR_BANK_CODE = '00000';
        const TEST_CONNECTOR_PASSWORD_REGEXP = '^(?=[1-4]{4}$)(?!.*(.).*\\1).*$';
        rawCopy.code = TEST_CONNECTOR_BANK_CODE;
        rawCopy.fields = rawCopy.fields.map(item =>
          item.name === IBankField.PASSWORD ? { ...item, regex: TEST_CONNECTOR_PASSWORD_REGEXP } : item,
        );
      }

      const mappedFields: BankField[] = rawCopy.fields.map(field =>
        field.type === IBankField.LIST
          ? new BankField({
              validation: field.regex ? new RegExp(field.regex) : null,
              options: field.values.map(item => ({
                name: item.label,
                value: item.value,
              })),
              type: IBankField[field.type.toUpperCase()],
              name: field.name,
              label: field.label,
            })
          : new BankField({
              label: field.label,
              name: field.name,
              type: IBankField[field.type.toUpperCase()],
              validation: field.regex ? new RegExp(field.regex) : null,
              options: null,
            }),
      );

      const bankCode = bankCodes[rawCopy.uuid]
        ? new BankCode(bankCodes[rawCopy.uuid]).value
        : new BankCode(rawCopy.code).value;
      const logo = `${this.blobStorageEndpoint}/logo-bank/${rawCopy.uuid}.png`;

      return new Bank({
        uid: rawCopy.uuid,
        form: mappedFields.filter(
          field =>
            field.type !== IBankField.LIST ||
            (field.type === IBankField.LIST && field.label === FieldLabel.REGION),
        ),
        logo,
        name: rawCopy.name,
        code: bankCode,
        featured: featuredBanks.includes(rawCopy.uuid),
      });
    } catch (err) {
      return null;
    }
  }
}
