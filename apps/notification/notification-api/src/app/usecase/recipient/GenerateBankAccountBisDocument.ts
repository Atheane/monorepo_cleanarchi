import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { BisGenerationTemplatePayload } from '../../adapters/types/BisGenerationTemplatePayload';
import { Identifiers } from '../../di/Identifiers';
import { Recipient } from '../../domain/entities/Recipient';
import { RecipientRepository } from '../../domain/repositories/RecipientRepository';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { BankIdentity } from '../../domain/types/BankIdentity';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';
import { Iban } from '../../domain/valuesObjects/Iban';

export interface GenerateBankAccountBisDocumentCommand {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
}

@injectable()
export class GenerateBankAccountBisDocument implements Usecase<GenerateBankAccountBisDocumentCommand, {}> {
  constructor(
    @inject(Identifiers.ProcessNotificationI)
    private readonly processNotificationI: ProcessNotificationI,
    @inject(Identifiers.RecipientRepository)
    private readonly recipientRepository: RecipientRepository,
  ) {}

  async execute(command: GenerateBankAccountBisDocumentCommand): Promise<DataSendType> {
    const { iban, bic } = command;
    const recipient: Recipient = await this.recipientRepository.findBy(command.uid);
    const dataToInsertInHTMLTemplateGeneration: BisGenerationTemplatePayload = this.getBisGenerationTemplatePayload(
      recipient,
      {
        iban,
        bic,
      },
    );
    const pathInBlobStorageToStoreBisDocument = `bis/${command.uid}/${command.bid}.pdf`;
    const settingsForBisDocummentGeneration = {
      contentBodyPath: `bankAccountBisDocument/pdf.fr.create_bis.html`,
      path: pathInBlobStorageToStoreBisDocument,
      channel: ChannelEnum.PDF,
    };

    return this.processNotificationI.processNotification(
      dataToInsertInHTMLTemplateGeneration,
      settingsForBisDocummentGeneration,
    );
  }

  private getBisGenerationTemplatePayload(recipient: Recipient, bankIdentity: Omit<BankIdentity, 'bid'>) {
    const { profile, uid } = recipient.props;
    const { address, lastName, firstName } = profile;
    const { iban, bic } = bankIdentity;
    const bankAccountDetails = Iban.extractIbanDetails(iban);
    return {
      account: {
        uid,
        iban,
        bic,
      },
      user: {
        profile: {
          address: {
            street: address.street,
            city: address.city,
            zip_code: address.zipCode,
            country: address.country,
          },
          birth_name: lastName,
          first_name: firstName,
        },
      },
      bank_details: {
        account_number: bankAccountDetails.accountNumber,
        bank_code: bankAccountDetails.bankCode,
        branch_code: bankAccountDetails.branchCode,
        check_digits: bankAccountDetails.checkDigits,
      },
    };
  }
}
