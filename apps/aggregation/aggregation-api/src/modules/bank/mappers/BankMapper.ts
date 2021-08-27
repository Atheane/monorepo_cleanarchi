import { Bank } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { IBank, IBankWithForm } from '../dto/IBank';

@injectable()
export class BankMapper implements Mapper<Bank> {
  fromDomain(bank: Bank): IBank {
    return {
      uid: bank.uid,
      logo: bank.logo,
      name: bank.name,
      code: bank.code,
    };
  }
  fromDomainWithForm(bank: Bank): IBankWithForm {
    return {
      ...bank,
      form: bank.form.map(fields => ({
        ...fields,
        validation: fields.validation ? fields.validation.source : null,
      })),
    };
  }
}
