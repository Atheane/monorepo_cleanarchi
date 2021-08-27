import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { BankAccountOpened } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { GenerateBankAccountBisDocument } from '../../usecase/recipient/GenerateBankAccountBisDocument';

@injectable()
export class BankAccountOpenedHandler extends DomainEventHandler<BankAccountOpened> {
  private readonly generateBankAccountBisDocument: GenerateBankAccountBisDocument;

  constructor(
    @inject(Identifiers.GenerateBankAccountBisDocument)
    generateBankAccountBisDocument: GenerateBankAccountBisDocument,
  ) {
    super();
    this.generateBankAccountBisDocument = generateBankAccountBisDocument;
  }

  async handle({ props }: BankAccountOpened): Promise<void> {
    defaultLogger.info(`handle BankAccountOpened event user: ${props.uid}`);
    await this.generateBankAccountBisDocument.execute(props);
  }
}
