import {
  AccountSynchronized,
  BankAccountAggregated,
  BankConnectionDeleted,
  BankConnectionUpdated,
} from '@oney/aggregation-messages';
import { configureInMemoryEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import {
  SplitContractClosed,
  SplitContractCreated,
  SplitPaymentScheduleCreated,
  SplitPaymentScheduleUpdated,
  SplitSimulated,
} from '@oney/credit-messages';
import { buildDomainEventDependencies } from '@oney/ddd';
import { configureEventHandler, ZipEventMessageBodySerializer } from '@oney/messages-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { PreferencesUpdated, TransferOutExecuted } from '@oney/notification-messages';
import {
  BankAccountMonthlyAllowanceUpdated,
  CardCreated,
  CardPreferencesUpdated,
  CardSent,
  CardStatusUpdated,
  CardStatusUpdateReceived,
  CardTransactionReceived,
  ClearingReceived,
  DebtCreated,
  DebtUpdated,
  DiligenceSctInReceived,
  EkycUpdated,
  KycDiligenceFailed,
  KycDiligenceSucceeded,
  LcbFtUpdated,
  PaymentCreated,
  RawSmoDebtReceived,
  SctInReceived,
  SctOutExecuted,
  TransferCreated,
} from '@oney/payment-messages';
import {
  AddressStepValidated,
  CivilStatusValidated,
  DiligenceSctInCompleted,
  FiscalStatusValidated,
  PhoneStepValidated,
  ProfileActivated,
  UserFacematchValidated,
  UserKycDecisionUpdated,
} from '@oney/profile-messages';
import { Container } from 'inversify';
import { defaultLogger } from '@oney/logger-adapters';
import { AccountSynchronizedHandler } from './aggregation/AccountSynchronized';
import { BankAccountAggregatedHandler } from './aggregation/BankAccountAggregatedHandler';
import { BankConnectionDeletedHandler } from './aggregation/BankConnectionDeletedHandler';
import { BankConnectionUpdatedHandler } from './aggregation/BankConnectionUpdatedHandler';
import { SplitContractClosedHandler } from './credit/SplitContractClosedHandler';
import { SplitContractCreatedHandler } from './credit/SplitContractCreatedHandler';
import { SplitPaymentScheduleCreatedHandler } from './credit/SplitPaymentScheduleCreatedHandler';
import { SplitPaymentScheduleUpdatedHandler } from './credit/SplitPaymentScheduleUpdatedHandler';
import { SplitSimulatedHandler } from './credit/SplitSimulatedHandler';
import { PreferencesUpdatedHandler } from './notification/PreferencesUpdatedHandler';
import { TransferOutExecutedHandler } from './notification/TransferOutExecutedHandler';
import { BankAccountMonthlyAllowanceUpdatedHandler } from './payment/BankAccountMonthlyAllowanceUpdatedHandler';
import { CardCreatedHandler } from './payment/CardCreatedHandler';
import { CardPreferencesUpdatedHandler } from './payment/CardPreferencesUpdatedHandler';
import { CardSentHandler } from './payment/CardSentHandler';
import { CardStatusUpdatedHandler } from './payment/CardStatusUpdatedHandler';
import { CardStatusUpdateReceivedHandler } from './payment/CardStatusUpdateReceivedHandler';
import { CardTransactionReceivedHandler } from './payment/CardTransactionReceivedHandler';
import { ClearingReceivedHandler } from './payment/ClearingReceivedHandler';
import { DebtCreatedHandler } from './payment/DebtCreatedHandler';
import { DebtUpdatedHandler } from './payment/DebtUpdatedHandler';
import { DiligenceSctInReceivedHandler } from './payment/DiligenceSctInReceivedHandler';
import { EkycUpdatedHandler } from './payment/EkycUpdatedHandler';
import { KycDiligenceFailedHandler } from './payment/KycDiligenceFailedHandler';
import { KycDiligenceSucceededHandler } from './payment/KycDiligenceSucceededHandler';
import { LcbFtUpdatedHandler } from './payment/LcbFtUpdatedHandler';
import { PaymentCreatedHandler } from './payment/PaymentCreatedHandler';
import { RawSmoDebtReceivedHandler } from './payment/RawSmoDebtReceivedHandler';
import { SctOutExecutedHandler } from './payment/SctOutExecutedHandler';
import { TransferCreatedHandler } from './payment/TransferCreatedHandler';
import { AddressStepValidatedHandler } from './profile/AddressStepValidatedHandler';
import { CivilStatusValidatedHandler } from './profile/CivilStatusValidatedHandler';
import { DiligenceSctInCompletedHandler } from './profile/DiligenceSctInCompletedHandler';
import { FiscalStatusValidatedHandler } from './profile/FiscalStatusValidatedHandler';
import { PhoneStepValidatedHandler } from './profile/PhoneStepValidatedHandler';
import { ProfileActivatedHandler } from './profile/ProfileActivatedHandler';
import { UserFacematchValidatedHandler } from './profile/UserFacematchValidatedHandler';
import { UserKycDecisionUpdatedHandler } from './profile/UserKycDecisionUpdatedHandler';
import { SctInReceivedHandler } from './payment/SctInReceivedHandler';
import { AppConfiguration } from '../../configuration/app/AppConfiguration';

export async function SetupEventHandlers(container: Container) {
  // BankAccountUncappedFromAggregation
  // BankAccountOpened
  // BankAccountCreated
  // ThirdPartyAuthFinished
  // IdentityDocumentValidated
  // CustomerServiceDemandSent
  // ConsentUpdated

  const config = container.get(AppConfiguration);

  // todo support mongo
  configureInMemoryEventHandlerExecution(container);

  buildDomainEventDependencies(container).usePlugin(
    createAzureConnection(
      config.serviceBusConnectionString,
      config.cdpSubscription,
      config.cdpTopic,
      defaultLogger,
      container.get(EventHandlerExecutionFinder),
      container.get(EventHandlerExecutionStore),
    ),
  );

  await configureEventHandler(container, em => {
    em.register(AccountSynchronized, AccountSynchronizedHandler, {
      topic: config.aggregationTopic,
      customSerializer: new ZipEventMessageBodySerializer(),
    });
    em.register(BankAccountAggregated, BankAccountAggregatedHandler, {
      topic: config.aggregationTopic,
    });
    em.register(BankConnectionDeleted, BankConnectionDeletedHandler, {
      topic: config.aggregationTopic,
    });
    em.register(BankConnectionUpdated, BankConnectionUpdatedHandler, {
      topic: config.aggregationTopic,
    });

    em.register(SplitContractClosed, SplitContractClosedHandler, {
      topic: config.creditTopic,
    });
    em.register(SplitContractCreated, SplitContractCreatedHandler, {
      topic: config.creditTopic,
    });
    em.register(SplitPaymentScheduleCreated, SplitPaymentScheduleCreatedHandler, {
      topic: config.creditTopic,
    });
    em.register(SplitPaymentScheduleUpdated, SplitPaymentScheduleUpdatedHandler, {
      topic: config.creditTopic,
    });
    em.register(SplitSimulated, SplitSimulatedHandler, {
      topic: config.creditTopic,
    });

    em.register(PreferencesUpdated, PreferencesUpdatedHandler, {
      topic: config.notificationTopic,
    });
    em.register(SctInReceived, SctInReceivedHandler, {
      topic: config.transactionTopic,
    });
    em.register(TransferOutExecuted, TransferOutExecutedHandler, {
      topic: config.transactionTopic,
    });

    em.register(BankAccountMonthlyAllowanceUpdated, BankAccountMonthlyAllowanceUpdatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(CardCreated, CardCreatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(CardPreferencesUpdated, CardPreferencesUpdatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(CardSent, CardSentHandler, {
      topic: config.paymentTopic,
    });
    em.register(CardStatusUpdated, CardStatusUpdatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(CardStatusUpdateReceived, CardStatusUpdateReceivedHandler, {
      topic: config.cardLifecycleFunctionTopic,
    });
    em.register(CardTransactionReceived, CardTransactionReceivedHandler, {
      topic: config.transactionTopic,
    });
    em.register(ClearingReceived, ClearingReceivedHandler, {
      topic: config.transactionTopic,
    });
    em.register(DebtCreated, DebtCreatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(DebtUpdated, DebtUpdatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(DiligenceSctInReceived, DiligenceSctInReceivedHandler, {
      topic: config.paymentAzfEkycTopic,
    });
    em.register(EkycUpdated, EkycUpdatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(KycDiligenceFailed, KycDiligenceFailedHandler, {
      topic: config.paymentTopic,
    });
    em.register(KycDiligenceSucceeded, KycDiligenceSucceededHandler, {
      topic: config.paymentTopic,
    });
    em.register(LcbFtUpdated, LcbFtUpdatedHandler, {
      topic: config.paymentAzfEkycTopic,
    });
    em.register(PaymentCreated, PaymentCreatedHandler, {
      topic: config.paymentTopic,
    });
    em.register(RawSmoDebtReceived, RawSmoDebtReceivedHandler, {
      topic: config.paymentTopic,
    });
    em.register(SctOutExecuted, SctOutExecutedHandler, {
      topic: config.transactionTopic,
    });
    em.register(TransferCreated, TransferCreatedHandler, {
      topic: config.paymentTopic,
    });

    em.register(AddressStepValidated, AddressStepValidatedHandler, {
      topic: config.profileTopic,
    });
    em.register(CivilStatusValidated, CivilStatusValidatedHandler, {
      topic: config.profileTopic,
    });
    em.register(DiligenceSctInCompleted, DiligenceSctInCompletedHandler, {
      topic: config.profileTopic,
    });
    em.register(FiscalStatusValidated, FiscalStatusValidatedHandler, {
      topic: config.profileTopic,
    });
    em.register(PhoneStepValidated, PhoneStepValidatedHandler, {
      topic: config.profileTopic,
    });
    em.register(ProfileActivated, ProfileActivatedHandler, {
      topic: config.profileTopic,
    });
    em.register(UserFacematchValidated, UserFacematchValidatedHandler, {
      topic: config.profileTopic,
    });
    em.register(UserKycDecisionUpdated, UserKycDecisionUpdatedHandler, {
      topic: config.profileAzfTopic,
    });
  });
}
