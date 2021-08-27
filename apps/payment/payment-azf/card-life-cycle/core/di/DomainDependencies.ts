import { CallbackPayloadRepository } from '../domain/repositories/CallbackPayloadRepository';
import { BankAccountRepository } from '../domain/repositories/LegacyBankAccountRepository';
import { ProcessCardLifecycleCallback } from '../usecases/ProcessCardLifecycleCallback';

export interface DomainDependencies {
  processCardLifecycleCallback: ProcessCardLifecycleCallback;
  callbackPayloadRepository: CallbackPayloadRepository;
  bankAccountRepository: BankAccountRepository;
}
