const Identifiers = {
  FindPreferences: Symbol.for('FindPreferences'),
  UpdatePreferences: Symbol.for('UpdatePreferences'),
  RefreshClient: Symbol.for('RefreshClient'),
  SendTransferNotification: Symbol.for('SendTransferNotification'),
  SendCustomerServiceNotification: Symbol.for('SendCustomerServiceNotification'),
  GeneratePaymentSchedule: Symbol.for('GeneratePaymentSchedule'),
  WriterI: Symbol.for('WriterI'),
  ProcessNotificationI: Symbol.for('ProcessNotificationI'),
  SendNotificationI: Symbol.for('SendNotificationI'),
  SendProvisioningErrorNotification: Symbol.for('SendProvisioningErrorNotification'),
  GenerateBankAccountBisDocument: Symbol.for('GenerateBankAccountBisDocument'),
  RecipientRepository: Symbol.for('RecipientRepository'),
  RegisterRecipient: Symbol.for('RegisterRecipient'),
  RecipientMapper: Symbol.for('RecipientMapper'),
  SendAuthSignatureVerificationErrorNotification: Symbol.for(
    'SendAuthSignatureVerificationErrorNotification',
  ),
  SendOtpSms: Symbol.for('SendOtpSms'),
};

export { Identifiers };
