import { Container } from 'inversify';
import { Identifiers } from './Identifiers';
import { ProcessNotification } from '../adapters/services/ProcessNotification';
import { SendNotification } from '../adapters/services/SendNotification';
import { Writer } from '../adapters/services/Writer';
import { ProcessNotificationI } from '../domain/services/ProcessNotificationI';
import { SendNotificationI } from '../domain/services/SendNotificationI';
import { WriterI } from '../domain/services/WriterI';
import { GeneratePaymentSchedule } from '../usecase/payment_schedule/GeneratePaymentSchedule';
import { UpdatePreferences } from '../usecase/preferences/UpdatePreferences';
import { RefreshClient } from '../usecase/RefreshClient';
import { SendTransferNotification } from '../usecase/payment/SendTransferNotification';
import { SendProvisioningErrorNotification } from '../usecase/authentication/SendProvisioningErrorNotification';
import { GenerateBankAccountBisDocument } from '../usecase/recipient/GenerateBankAccountBisDocument';
import { RecipientRepository } from '../domain/repositories/RecipientRepository';
import { MongoRecipientRepository } from '../adapters/repositories/recipient/MongoRecipientRepository';
import { RecipientMapper } from '../adapters/mappers/RecipientMapper';
import { GetRecipient } from '../usecase/recipient/GetRecipient';
import { RegisterRecipient } from '../usecase/recipient/RegisterRecipient';
import { SendCustomerServiceNotification } from '../usecase/profile/SendCustomerServiceNotification';
import { SendOtpSms } from '../usecase/profile/SendOtpSms';
import { SendAuthSignatureVerificationErrorNotification } from '../usecase/authentication/SendAuthSignatureVerificationErrorNotification';

export function buildDomain(container: Container): void {
  container.bind<UpdatePreferences>(Identifiers.UpdatePreferences).to(UpdatePreferences);
  container.bind<RefreshClient>(Identifiers.RefreshClient).to(RefreshClient);
  container.bind<SendTransferNotification>(Identifiers.SendTransferNotification).to(SendTransferNotification);
  container
    .bind<SendCustomerServiceNotification>(Identifiers.SendCustomerServiceNotification)
    .to(SendCustomerServiceNotification);
  container.bind<GeneratePaymentSchedule>(Identifiers.GeneratePaymentSchedule).to(GeneratePaymentSchedule);
  container.bind<WriterI>(Identifiers.WriterI).to(Writer);
  container.bind<ProcessNotificationI>(Identifiers.ProcessNotificationI).to(ProcessNotification);
  container.bind<SendNotificationI>(Identifiers.SendNotificationI).to(SendNotification);
  container
    .bind<SendProvisioningErrorNotification>(Identifiers.SendProvisioningErrorNotification)
    .to(SendProvisioningErrorNotification);
  container
    .bind<GenerateBankAccountBisDocument>(Identifiers.GenerateBankAccountBisDocument)
    .to(GenerateBankAccountBisDocument);
  container.bind<RecipientRepository>(Identifiers.RecipientRepository).to(MongoRecipientRepository);
  container.bind<RecipientMapper>(RecipientMapper).toSelf();
  container.bind<RegisterRecipient>(Identifiers.RegisterRecipient).to(RegisterRecipient);
  container.bind<GetRecipient>(GetRecipient).to(GetRecipient);
  container
    .bind<SendAuthSignatureVerificationErrorNotification>(
      Identifiers.SendAuthSignatureVerificationErrorNotification,
    )
    .to(SendAuthSignatureVerificationErrorNotification);
  container.bind<SendOtpSms>(Identifiers.SendOtpSms).to(SendOtpSms);
}
