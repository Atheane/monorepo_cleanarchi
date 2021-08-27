import { AggregateRoot, Handle } from '@oney/ddd';
import {
  BalanceLimitUpdated,
  BankAccountCreated,
  BankAccountCreatedProps,
  BankAccountEligibilityGranted,
  BankAccountMonthlyAllowanceUpdated,
  BankAccountOpened,
  CardCreated,
  CardStatusUpdated,
  DebtCreated,
  DebtCreatedProps,
  DebtUpdated,
  ExposureUpdated,
  GlobalOutUpdated,
  LimitInformationInitialized,
  UncappingEventReason,
  UncappingEventState,
  UncappingStateChanged,
  SplitPaymentEligibilityUpdated,
  TechnicalLimitCalculated,
  GlobalInUpdated,
  DebtCollected,
  AccountCeilingConsumptionUpdated,
  BeneficiaryCreated,
  KycDiligenceSucceeded,
  KycDiligenceSucceededProps,
} from '@oney/payment-messages';
import { PartialExceptFor, subtract } from '@oney/common-core';
import { ProfileInfos } from '@oney/profile-messages';
import { defaultLogger } from '@oney/logger-adapters';
import { Operation } from './Operation';
import { Transfer } from './Transfer';
import { CardError } from '../../models/errors/PaymentErrors';
import { CreateBankAccountRequest } from '../../usecases/bankAccount/commands/CreateBankAccountRequest';
import { Beneficiary, BeneficiaryProperties } from '../entities/Beneficiary';
import { Card, CardProperties } from '../entities/Card';
import { Collection } from '../entities/Collection';
import { Debt, DebtStatus } from '../entities/Debt';
import { MonthlyAllowance } from '../types/MonthlyAllowance';
import { DiligenceStatus } from '../types/DiligenceStatus';
import {
  GlobalLimits,
  LimitInformation,
  LimitInformationProperties,
  SettableLimitInformation,
} from '../valueobjects/bankAccount/LimitInformation';
import { ProductsEligibility } from '../valueobjects/bankAccount/ProductsEligibility';
import { ExposureFormulaCommand } from '../types/ExposureFormulaCommand';
import { Exposure } from '../valueobjects/Exposure';
import { UncappingState } from '../valueobjects/bankAccount/UncappingState';
import { UncappingReason } from '../valueobjects/bankAccount/UncappingReason';
import { DebtCollection } from '../types/DebtCollection';
import { DiligencesType } from '../types/DiligencesType';
import { OperationProperties } from './OperationProperties';

export interface BankAccountProperties {
  uid: string;
  iban: string;
  bic: string;
  bankAccountId: string;
  beneficiaries?: Beneficiary[];
  cards?: Card[];
  debts?: Debt[];
  monthlyAllowance?: MonthlyAllowance;
  kycDiligenceStatus?: DiligenceStatus;
  kycDiligenceValidationMethod?: DiligencesType;
  limits?: LimitInformation;
  uncappingState: UncappingState;
  productsEligibility: ProductsEligibility;
  exposure?: Exposure;
}

export class BankAccount extends AggregateRoot<BankAccountProperties> {
  props: BankAccountProperties;

  constructor(props: PartialExceptFor<BankAccountProperties, 'uid'>) {
    super(props.uid);
    const {
      uid,
      iban = '',
      bic = '',
      bankAccountId = '',
      beneficiaries = [],
      cards = [],
      debts = [],
      monthlyAllowance = {
        authorizedAllowance: 0,
        remainingFundToSpend: 0,
        spentFunds: 0,
      },
      kycDiligenceStatus = DiligenceStatus.TODO,
      kycDiligenceValidationMethod = DiligencesType.UNKNOWN,
      limits = {
        props: {
          balanceLimit: 0,
          technicalLimit: 0,
          globalIn: {
            monthlyAllowance: 0,
            annualAllowance: 0,
            weeklyAllowance: 0,
          },
          globalOut: {
            monthlyAllowance: 0,
            annualAllowance: 0,
            weeklyAllowance: 0,
          },
        },
      },
      uncappingState = UncappingState.CAPPED,
      productsEligibility = {
        account: false,
        splitPayment: true,
      },
    } = props;
    this.props = {
      uid,
      iban,
      bic,
      bankAccountId,
      beneficiaries,
      cards,
      debts,
      monthlyAllowance,
      kycDiligenceStatus,
      kycDiligenceValidationMethod,
      limits,
      uncappingState: uncappingState,
      productsEligibility,
    };
  }

  isEligibleForAccountProduct(): boolean {
    return this.props.productsEligibility.account;
  }

  getSplitPaymentProductEligibility(): boolean {
    return this.props.productsEligibility.splitPayment;
  }

  isSplitPaymentEligibilityGranted(): boolean {
    return this.props.productsEligibility.splitPayment === true;
  }

  denySplitPaymentEligibility(): void {
    this.applyChange(new SplitPaymentEligibilityUpdated({ eligibility: false }));
  }

  @Handle(SplitPaymentEligibilityUpdated)
  applyWithdrawnSplitPaymentEligibility({ props }: SplitPaymentEligibilityUpdated): void {
    this.props.productsEligibility.splitPayment = props.eligibility;
  }

  grantSplitPaymentEligibility(): void {
    this.applyChange(new SplitPaymentEligibilityUpdated({ eligibility: true }));
  }

  @Handle(SplitPaymentEligibilityUpdated)
  applyGrantSplitPaymentEligibility({ props }: SplitPaymentEligibilityUpdated): void {
    this.props.productsEligibility.splitPayment = props.eligibility;
  }

  //fixme must send a domainEvent.
  getCardById(cardId: string): Card {
    const card = this.props.cards.find(card => card.id === cardId);
    if (!card) {
      throw new CardError.CardNotFound('CARD_NOT_FOUND');
    }
    return card;
  }

  orderCard(props: CardProperties): Card {
    this.applyChange(new CardCreated(props));
    return new Card(props);
  }

  @Handle(CardCreated)
  applyOrderCard(props: CardProperties): void {
    this.props.cards.push(new Card(props));
  }

  addBeneficiary(props: BeneficiaryProperties): Beneficiary {
    this.applyChange(new BeneficiaryCreated(props));
    return new Beneficiary(props);
  }

  @Handle(BeneficiaryCreated)
  applyAddBeneficiary(props: BeneficiaryProperties): void {
    this.props.beneficiaries.push(new Beneficiary(props));
  }

  createOperation(operationProperties: OperationProperties): Operation {
    return Operation.create(operationProperties);
  }

  updateCard(props: CardProperties): Card {
    const updatedCard = new Card(props);
    this.applyChange(
      new CardStatusUpdated({
        id: updatedCard.props.id,
        type: updatedCard.props.type,
        status: updatedCard.props.status,
        userId: this.props.uid,
        ref: updatedCard.props.ref,
      }),
    );
    return updatedCard;
  }

  @Handle(CardStatusUpdated)
  applyUpdateCard(props: CardProperties): void {
    const updatedCard = new Card(props);
    this.props.cards = this.props.cards.map(card => {
      const foundCard = this.props.cards.find(c => c.id == props.id);
      return foundCard ? updatedCard : card;
    });
  }

  updateMonthlyAllowance(monthlyAllowance: MonthlyAllowance, monthlyUsedAllowance: number): void {
    defaultLogger.info(`Start Updating monthlyAllowance for Account ID ${this.props.uid}`);
    defaultLogger.info(`With Provided field monthlyAllowance`, monthlyAllowance);

    this.applyChange(
      new BankAccountMonthlyAllowanceUpdated({
        monthlyAllowance,
      }),
    );

    defaultLogger.info(
      `Calculation with formula: monthlyUsedAllowance - (technicalLimit - monthlyAllowance)`,
      monthlyUsedAllowance,
    );
    defaultLogger.info(
      `Calculation with formula: ${monthlyUsedAllowance} - (${this.props.limits.props.technicalLimit} - ${this.props.limits.props.globalOut.monthlyAllowance})`,
      monthlyUsedAllowance,
    );

    const spentFunds = subtract(
      monthlyUsedAllowance,
      subtract(this.props.limits.props.technicalLimit, this.props.limits.props.globalOut.monthlyAllowance),
    );

    defaultLogger.info(`calculated spentFunds: ${spentFunds}`);
    this.applyChange(new AccountCeilingConsumptionUpdated({ consumed: spentFunds }));
  }

  @Handle(BankAccountMonthlyAllowanceUpdated)
  applyUpdateMonthlyAllowance(event: BankAccountMonthlyAllowanceUpdated): void {
    this.props.monthlyAllowance = { ...event.props.monthlyAllowance };
  }

  @Handle(AccountCeilingConsumptionUpdated)
  applyAccountCeilingConsumptionUpdated(event: AccountCeilingConsumptionUpdated): void {
    this.props.monthlyAllowance.spentFunds = event.props.consumed;
  }

  uncap(reason: UncappingReason, globalOut: GlobalLimits, balanceLimit: number): void {
    this.applyChange(
      new UncappingStateChanged({
        uncappingState: UncappingEventState.UNCAPPED,
        reason: UncappingEventReason[reason.toUpperCase()],
      }),
    );
    this.updateLimits({ globalOut, balanceLimit });
  }

  grantAccountEligibility(accountEligibility: boolean): void {
    this.applyChange(new BankAccountEligibilityGranted({ accountEligibility }));
  }

  @Handle(BankAccountEligibilityGranted)
  private applyGrantAccountEligibility(eligibility: BankAccountEligibilityGranted): void {
    this.props = {
      ...this.props,
      productsEligibility: {
        ...this.props.productsEligibility,
        account: eligibility.props.accountEligibility,
      },
    };
  }

  createDebt({ props: DebtProps }: Debt): void {
    const debtCreatedProps: DebtCreatedProps = {
      ...DebtProps,
      collections: DebtProps.collections.map(collection => collection.props),
    };
    this.applyChange(new DebtCreated(debtCreatedProps));
  }

  @Handle(DebtCreated)
  applyCreateDebt({ props }: DebtCreated): void {
    const newCollections = props.collections.map(collectionProps => new Collection(collectionProps));
    const newDebt = new Debt({ ...props, collections: newCollections });
    const newDebts = this.props.debts ? this.props.debts.concat(newDebt) : [newDebt];
    this.props = { ...this.props, debts: newDebts };
  }

  updateDebt({ props: DebtProps }: Debt): void {
    const debtUpdatedProps: DebtCreatedProps = {
      ...DebtProps,
      collections: DebtProps.collections.map(collection => collection.props),
    };
    this.applyChange(new DebtUpdated(debtUpdatedProps));
  }

  @Handle(DebtUpdated)
  applyUpdateDebt({ props: eventProps }: DebtUpdated): void {
    this.props.debts = this.props.debts.map(item => {
      if (item.props.id === eventProps.id) {
        const defaultCollectionProps = eventProps.collections.length > 0 ? eventProps.collections : [];
        const newcCollections = defaultCollectionProps.map(
          collectionProps => new Collection(collectionProps),
        );
        const updatedDebt = new Debt({ ...eventProps, collections: newcCollections });
        return updatedDebt;
      }
      return item;
    });
  }
  //fixme this must send a domainEvent or this method should be elsewhere
  hasMonthlyAllowance(): boolean {
    return !!this.props.monthlyAllowance;
  }
  //fixme this must send a domainEvent or this method should be elsewhere
  hasKycDiligenceStatus(): boolean {
    return !!this.props.kycDiligenceStatus;
  }

  hasLimits(): boolean {
    return !!this.props.limits;
  }

  isUncapped(): boolean {
    return this.props.uncappingState === UncappingState.UNCAPPED;
  }

  open(bid: string, iban: string, bic: string): BankAccount {
    this.props.bankAccountId = bid;
    this.props.iban = iban;
    this.props.bic = bic;

    this.addDomainEvent(
      new BankAccountOpened({
        uid: this.id,
        bid,
        iban,
        bic,
      }),
    );
    return this;
  }

  public static create(param: CreateBankAccountRequest & ProfileInfos): BankAccount {
    const { uid, email, informations, street, additionalStreet, city, zipCode, country } = param;
    const { firstName, legalName, birthName, birthCountry, birthDate, phone } = informations;
    const lastName = legalName || birthName;

    const bankAccount = new BankAccount({
      uid,
    });

    const bankAccountToCreate: BankAccountCreatedProps = {
      uid,
      firstName,
      lastName,
      email,
      birthCountry,
      birthDate,
      address: {
        city,
        country,
        street,
        zipCode,
      },
      phone,
    };
    if (additionalStreet) bankAccountToCreate.address.additionalStreet = additionalStreet;

    bankAccount.addDomainEvent(new BankAccountCreated(bankAccountToCreate));

    return bankAccount;
  }

  initLimits(limitInformation: LimitInformationProperties): BankAccount {
    const { balanceLimit, globalIn, globalOut } = limitInformation;
    this.applyChange(
      new LimitInformationInitialized({
        limitInformation: {
          balanceLimit: balanceLimit,
          technicalLimit: globalOut.monthlyAllowance,
          globalOut: globalOut,
          globalIn: globalIn,
        },
        uid: this.props.uid,
      }),
    );

    return this;
  }

  @Handle(LimitInformationInitialized)
  applyInitLimits(event: LimitInformationInitialized): void {
    this.props.limits = new LimitInformation(event.props.limitInformation);
  }

  calculateExposure({
    balance,
    feeRateOfSplitPayment,
    maxFeeAmountOfSplitPayment,
    minPurchaseAmountToAllowSplitPayment,
  }: ExposureFormulaCommand): Exposure {
    const exposure: Exposure = { amount: 0 };
    const limit = maxFeeAmountOfSplitPayment * (1 + 1 / (4 * feeRateOfSplitPayment));
    if (balance > limit) {
      const exposureComparator = 3 * balance - 4 * maxFeeAmountOfSplitPayment;
      const amount = Math.max(0, exposureComparator);
      exposure.amount = Math.round(amount * 100) / 100;
    } else {
      const exposureComparator =
        (balance * (3 - 4 * feeRateOfSplitPayment)) / (1 + 4 * feeRateOfSplitPayment);
      const amount = Math.max(0, exposureComparator);
      exposure.amount = Math.round(amount * 100) / 100;
    }

    const autorizedAmountToPourchase = balance + exposure.amount;
    if (autorizedAmountToPourchase < minPurchaseAmountToAllowSplitPayment) {
      exposure.amount = 0;
    }

    return exposure;
  }

  updateExposure(exposure: Exposure, balanceUsedForComputedExposure?: number): void {
    const balance = balanceUsedForComputedExposure;
    const exposureUpdatedEvent = new ExposureUpdated({
      amount: exposure.amount,
      insights: {
        ...(balance && { balance }),
        splitPaymentEligibility: this.props.productsEligibility.splitPayment,
      },
    });
    this.applyChange(exposureUpdatedEvent);
  }

  @Handle(ExposureUpdated)
  applyUpdateExposure({ props }: ExposureUpdated): void {
    this.props.exposure = {
      amount: props.amount,
    };
  }

  askUncapping(reason: UncappingReason): void {
    this.applyChange(
      new UncappingStateChanged({
        uncappingState: UncappingEventState[UncappingState.UNCAPPING.toUpperCase()],
        reason: UncappingEventReason[reason.toUpperCase()],
      }),
    );
  }

  @Handle(UncappingStateChanged)
  applyUncappingStateChanged({ props }: UncappingStateChanged): void {
    this.props.uncappingState = UncappingState[props.uncappingState.toUpperCase()];
  }

  rejectUncapping(reason: UncappingReason): void {
    this.applyChange(
      new UncappingStateChanged({
        uncappingState: UncappingEventState[UncappingState.CAPPED.toUpperCase()],
        reason: UncappingEventReason[reason.toUpperCase()],
      }),
    );
  }

  calculateTechnicalLimit(customMonthlyGlobalOutAllowance: number): void {
    const technicalLimit: number =
      this.props.limits.props.technicalLimit +
      (customMonthlyGlobalOutAllowance - this.props.limits.props.globalOut.monthlyAllowance);

    this.applyChange(
      new TechnicalLimitCalculated({
        technicalLimit,
        insights: {
          previousTechnicalLimit: this.props.limits.props.technicalLimit,
          globalOutLimit: customMonthlyGlobalOutAllowance,
        },
      }),
    );
  }

  calculateMonthlyTechnicalLimit(totalMensualites: number): void {
    const previousTechnicalLimit = this.props.limits.props.technicalLimit;
    const limitMonthlyGlobalOut = this.props.limits.props.globalOut.monthlyAllowance;
    const technicalLimit = limitMonthlyGlobalOut - totalMensualites;

    const technicalLimitCalculated = new TechnicalLimitCalculated({
      technicalLimit,
      insights: {
        previousTechnicalLimit,
        globalOutLimit: limitMonthlyGlobalOut,
        monthly: {
          totalAmount: totalMensualites,
        },
      },
    });

    this.applyChange(technicalLimitCalculated);
  }

  @Handle(TechnicalLimitCalculated)
  applyCalculateMonthlyTechnicalLimit({ props }: TechnicalLimitCalculated): void {
    this.props.limits.props.technicalLimit = props.technicalLimit;
  }

  calculateTechnicalLimitPostSingleSplitContract(
    fundingAmount: number,
    firstMountlyPaymentAmount: number,
    fees: number,
  ): void {
    const previousTechnicalLimit = this.props.limits.props.technicalLimit;
    const technicalLimit =
      this.props.limits.props.technicalLimit + fundingAmount - firstMountlyPaymentAmount - fees;

    const technicalLimitCalculated = new TechnicalLimitCalculated({
      technicalLimit,
      insights: {
        previousTechnicalLimit,
        contract: {
          fees,
          firstMountlyPayment: firstMountlyPaymentAmount,
          funding: fundingAmount,
        },
      },
    });

    this.applyChange(technicalLimitCalculated);
  }

  @Handle(TechnicalLimitCalculated)
  applyCalculateTechnicalLimitPostSingleSplitContract({ props }: TechnicalLimitCalculated): void {
    const technicalLimit = props.technicalLimit;
    this.props.limits.props.technicalLimit = technicalLimit;
  }

  getTechnicalLimit(): number {
    return this.props.limits.props.technicalLimit;
  }

  updateLimits({ globalIn, globalOut, balanceLimit }: SettableLimitInformation): void {
    if (globalIn) {
      this.applyChange(new GlobalInUpdated({ globalIn }));
    }
    if (globalOut) {
      this.applyChange(new GlobalOutUpdated({ globalOut }));
    }
    if (balanceLimit) {
      this.applyChange(new BalanceLimitUpdated({ balanceLimit }));
    }
  }

  @Handle(GlobalOutUpdated)
  applyUpdateGlobalOut({ props }: GlobalOutUpdated): void {
    this.props.limits.props.globalOut = props.globalOut;
  }

  @Handle(GlobalInUpdated)
  applyUpdateGlobalIn({ props }: GlobalInUpdated): void {
    this.props.limits.props.globalIn = props.globalIn;
  }

  @Handle(BalanceLimitUpdated)
  applyUpdateBalanceLimit({ props }: BalanceLimitUpdated): void {
    this.props.limits.props.balanceLimit = props.balanceLimit;
  }

  hasDebts(): boolean {
    return this.props.debts && this.props.debts.length > 0;
  }

  getUnpaidDebts(): Debt[] {
    if (!this.hasDebts) return [];

    const { debts } = this.props;
    const unpaidDebts = debts.filter(debt => {
      const isUnpaid = debt.props.status === DebtStatus.PENDING && debt.props.remainingDebtAmount > 0;
      return isUnpaid;
    });
    return unpaidDebts;
  }

  hasUnpaidDebts(): boolean {
    return this.getUnpaidDebts().length > 0;
  }

  getDebtById(id: string): Debt {
    return this.props.debts.find(debt => debt.id === id);
  }

  getDebtCollections(amount: number): DebtCollection[] {
    const debtCollections: DebtCollection[] = [];
    let currentTransferAmountForCollection = amount;

    const unpaidDebts = this.getUnpaidDebts();
    const unPaidDebtsFromOldestToNewest = unpaidDebts.sort(
      (a, b) => a.props.date.getTime() - b.props.date.getTime(),
    );

    for (const unpaidDebt of unPaidDebtsFromOldestToNewest) {
      const possibleAmountToCollect = unpaidDebt.canBeFullyCollected(currentTransferAmountForCollection)
        ? unpaidDebt.props.remainingDebtAmount
        : currentTransferAmountForCollection;
      debtCollections.push({ debt: unpaidDebt, amountToCollect: possibleAmountToCollect });
      currentTransferAmountForCollection = currentTransferAmountForCollection - possibleAmountToCollect;
      const nextDebtWillBeAbleToBeCollected = currentTransferAmountForCollection > 0;
      if (!nextDebtWillBeAbleToBeCollected) break;
    }
    return debtCollections;
  }

  collectDebt(debt: Debt, transfer: Transfer): void {
    this.applyChange(
      new DebtCollected({
        debt: {
          ...debt.props,
          collections: debt.props.collections.map(collection => collection.props),
        },
        transfer: transfer.props,
      }),
    );
  }

  @Handle(DebtCollected)
  applyCollectDebt({ props: collection }: DebtCollected): void {
    const { debt, transfer } = collection;
    const newRemainingDebtAmount = debt.remainingDebtAmount - transfer.amount;
    const collectionToCreate = new Collection({
      amount: transfer.amount,
      orderId: transfer.orderId,
      paidAt: transfer.executionDate,
    });

    const debtCollected = new Debt({
      ...debt,
      collections: debt.collections.map(collection => new Collection(collection)),
      remainingDebtAmount: newRemainingDebtAmount,
    });
    debtCollected.addCollection(collectionToCreate);

    if (debtCollected.isFullyCollected()) debtCollected.close();
    this.updateDebt(debtCollected);
  }

  validateKycDiligence(props: KycDiligenceSucceededProps): BankAccount {
    this.applyChange(new KycDiligenceSucceeded(props));
    return this;
  }

  @Handle(KycDiligenceSucceeded)
  applyValidateKycDiligence(event: KycDiligenceSucceeded) {
    this.props.kycDiligenceStatus = DiligenceStatus.VALIDATED;
    this.props.kycDiligenceValidationMethod = event.props.diligenceType;
  }

  findDebt(uid: string): Debt {
    return this.props.debts && this.props.debts.find(existedDebt => existedDebt.props.id === uid);
  }

  isDebtExist(debt: Debt): boolean {
    return !!this.findDebt(debt.props.id);
  }
}
