import { configureLogger } from '@oney/logger-adapters';
import { Container } from 'inversify';
import {
  AccountSynchronized,
  BankConnectionDeleted,
  ThirdPartyAuthFinished,
} from '@oney/aggregation-messages';
import { SplitPaymentScheduleCreated } from '@oney/credit-messages';
import { configureEventHandler, ZipEventMessageBodySerializer } from '@oney/messages-adapters';
import { TransferOutExecuted } from '@oney/notification-messages';
import {
  BankAccountCreated,
  BankAccountOpened,
  CardTransactionReceived,
  SctInReceived,
} from '@oney/payment-messages';
import { buildDomain } from './DomainDependencies';
import { Identifiers } from './Identifiers';
import { buildMiddleware } from './MiddlewareDependencies';
import { BankAccountCreatedHandler } from '../adapters/handlers/BankAccountCreatedHandler';
import { BankAccountOpenedHandler } from '../adapters/handlers/BankAccountOpenedHandler';
import { config } from '../config/config.env';
import { AccountSynchronizedHandler } from '../domain/aggregation/handlers/AccountSynchronizedHandler';
import { AggregationThirdPartyAuthFinishedHandler } from '../domain/aggregation/handlers/AggregationThirdPartyAuthFinishedHandler';
import { BankConnectionDeletedHandler } from '../domain/aggregation/handlers/BankConnectionDeletedHandler';
import { initPaymentSubscribers } from '../domain/payment/handlers';
import { PaymentScheduleHandler } from '../domain/payment_schedule/handlers/PaymentScheduleHandler';
import { initProfileSubscribers } from '../domain/profile/index';
import { CardTransactionHandler } from '../domain/transaction/handlers/CardTransactionHandler';
import { TransferOutHandler } from '../domain/transaction/handlers/TransferOutHandler';
import { GeneratePaymentSchedule } from '../usecase/payment_schedule/GeneratePaymentSchedule';
import { UpdatePreferences } from '../usecase/preferences/UpdatePreferences';
import { GenerateBankAccountBisDocument } from '../usecase/recipient/GenerateBankAccountBisDocument';
import { RegisterRecipient } from '../usecase/recipient/RegisterRecipient';
import { RefreshClient } from '../usecase/RefreshClient';
import { initAuthenticationSubscribers } from '../domain/authentication/handlers';
import { SendProvisioningErrorNotification } from '../usecase/authentication/SendProvisioningErrorNotification';
import { SendOtpSms } from '../usecase/profile/SendOtpSms';
import { SendAuthSignatureVerificationErrorNotification } from '../usecase/authentication/SendAuthSignatureVerificationErrorNotification';
import { SctInReceivedHandler } from '../domain/transaction/handlers/SctInReceivedHandler';

export class Kernel extends Container {
  constructor() {
    super();
    configureLogger(this);
    this.initDependencies();
  }

  initDependencies(): void {
    buildDomain(this);
    buildMiddleware(this);
  }

  getUseCases() {
    return {
      updatePreferences: this.get<UpdatePreferences>(Identifiers.UpdatePreferences),
      refreshClient: this.get<RefreshClient>(Identifiers.RefreshClient),
      generatePaymentSchedule: this.get<GeneratePaymentSchedule>(Identifiers.GeneratePaymentSchedule),
      generateBankAccountBisDocument: this.get<GenerateBankAccountBisDocument>(
        Identifiers.GenerateBankAccountBisDocument,
      ),
      registerRecipient: this.get<RegisterRecipient>(Identifiers.RegisterRecipient),
      sendProvisioningErrorNotification: this.get<SendProvisioningErrorNotification>(
        Identifiers.SendProvisioningErrorNotification,
      ),
      sendAuthSignatureVerificationErrorNotification: this.get<
        SendAuthSignatureVerificationErrorNotification
      >(Identifiers.SendAuthSignatureVerificationErrorNotification),
      sendOtpSms: this.get<SendOtpSms>(Identifiers.SendOtpSms),
    };
  }

  async initSubscribers(): Promise<void> {
    const {
      transactionFunctionsTopic,
      odbPaymentTopic,
      odbCreditTopic,
      odbAggregationTopic,
      odbAuthenticationTopic,
      odbProfileTopic,
    } = config.serviceBusConfiguration;
    await configureEventHandler(this, em => {
      // @oney/payment -> transactionFunctionsTopic -> CardTransactionReceived
      // @oney/notification -> transactionFunctionsTopic -> TransferInReceived
      // @oney/credit -> odbCreditTopic -> SplitPaymentScheduleCreated
      // @oney/aggregation -> odbAggregationTopic -> AccountSynchronized
      // @oney/payment -> odbPaymentTopic -> BankAccountOpenedHandler
      // @oney/authentication -> odbAuthenticationTopic -> PhoneProvisioningFailedHandler
      em.register(CardTransactionReceived, CardTransactionHandler, {
        topic: transactionFunctionsTopic,
      });
      em.register(SplitPaymentScheduleCreated, PaymentScheduleHandler, { topic: odbCreditTopic });
      em.register(SctInReceived, SctInReceivedHandler, {
        topic: transactionFunctionsTopic,
      });
      em.register(TransferOutExecuted, TransferOutHandler, {
        topic: transactionFunctionsTopic,
      });
      em.register(AccountSynchronized, AccountSynchronizedHandler, {
        topic: odbAggregationTopic,
        customSerializer: new ZipEventMessageBodySerializer(),
      });
      em.register(ThirdPartyAuthFinished, AggregationThirdPartyAuthFinishedHandler, {
        topic: odbAggregationTopic,
      });
      em.register(BankConnectionDeleted, BankConnectionDeletedHandler, { topic: odbAggregationTopic });
      em.register(BankAccountOpened, BankAccountOpenedHandler, { topic: odbPaymentTopic });
      em.register(BankAccountCreated, BankAccountCreatedHandler, { topic: odbPaymentTopic });

      initPaymentSubscribers(em, odbPaymentTopic);
      initProfileSubscribers(em, odbProfileTopic);
      initAuthenticationSubscribers(em, odbAuthenticationTopic);
    });
  }
}
