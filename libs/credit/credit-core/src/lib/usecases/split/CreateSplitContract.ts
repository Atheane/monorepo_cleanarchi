import { inject, injectable } from 'inversify';
import { ContractStatus, ScheduleKey } from '@oney/credit-messages';
import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Authorization, CanExecuteResult, Identity, ServiceName } from '@oney/identity-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import {
  ContractNumber,
  IdGenerator,
  PaymentService,
  SplitContract,
  SplitContractProperties,
  SplitContractRepository,
  SplitPaymentSchedule,
  SplitPaymentScheduleRepository,
  SplitSimulationRepository,
} from '../../domain';
import { IAppConfiguration } from '../../domain/models/IAppConfiguration';

export interface CreateSplitContractCommand {
  simulationId: string;
  bankAccountId: string;
}

@injectable()
export class CreateSplitContract implements Usecase<CreateSplitContractCommand, SplitContractProperties> {
  constructor(
    @inject(CreditIdentifiers.configuration) private readonly configuration: IAppConfiguration,
    @inject(CreditIdentifiers.splitSimulationRepository)
    private readonly simulationRepository: SplitSimulationRepository,
    @inject(CreditIdentifiers.splitContractRepository)
    private readonly contractRepository: SplitContractRepository,
    @inject(CreditIdentifiers.splitPaymentScheduleRepository)
    private readonly paymentScheduleRepository: SplitPaymentScheduleRepository,
    @inject(CreditIdentifiers.paymentService)
    private readonly paymentService: PaymentService,
    @inject(CreditIdentifiers.longIdGenerator)
    private readonly longIdGenerator: IdGenerator,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateSplitContractCommand): Promise<SplitContractProperties> {
    const { simulationId, bankAccountId } = request;

    const {
      userId,
      initialTransactionId,
      transactionDate,
      productCode,
      fundingAmount,
      apr,
      immediatePayments,
      deferredPayments,
      label,
    } = await this.simulationRepository.getById(simulationId);

    const contractNumber = new ContractNumber(6, 6).value;
    try {
      // if, for some reason, endpoint is called twice
      const resultContract = await this.contractRepository.getByInitialTransactionId(initialTransactionId);
      return resultContract;
    } catch (e) {
      //
    }

    const contract = SplitContract.create({
      userId,
      initialTransactionId,
      transactionDate,
      productCode,
      contractNumber,
      apr,
      subscriptionDate: new Date(),
      status: ContractStatus.IN_PROGRESS,
      bankAccountId,
      label,
      initialPaymentSchedule: {
        immediatePayments,
        deferredPayments,
      },
      termsVersion: this.configuration.odbCreditTermsVersion,
    });

    await this.contractRepository.save(contract.props);
    await this.eventDispatcher.dispatch(contract);

    const paymentSchedule = new SplitPaymentSchedule({
      id: this.longIdGenerator.generateUniqueID(),
      initialTransactionId,
      contractNumber,
      bankAccountId,
      status: ContractStatus.IN_PROGRESS,
      userId,
      productCode,
      label,
      apr,
    });

    paymentSchedule.scheduleFunding(fundingAmount);
    paymentSchedule.schedulePayments(contract.props.initialPaymentSchedule);

    const resultContract = contract.props;

    // funding
    const funding = await this.paymentService.executePayment(
      paymentSchedule.getProps.fundingExecution,
      userId,
      contractNumber,
      productCode,
    );
    if (funding) {
      paymentSchedule.executeScheduleFunding(funding);
    }

    // payment fees
    const feesPayment = await this.paymentService.executePayment(
      paymentSchedule.getProps.paymentsExecution.find(p => p.key === ScheduleKey.FEE),
      userId,
      contractNumber,
      productCode,
    );
    if (feesPayment) {
      paymentSchedule.executeSchedulePayments(feesPayment);
    }

    // payment first month
    const firstPayment = await this.paymentService.executePayment(
      paymentSchedule.getProps.paymentsExecution.find(p => p.key === ScheduleKey.M1),
      userId,
      contractNumber,
      productCode,
    );
    if (firstPayment) {
      paymentSchedule.executeSchedulePayments(firstPayment);
    }

    defaultLogger.info('save payment schedule and send event', paymentSchedule.getProps);
    const result = await this.paymentScheduleRepository.save(paymentSchedule.getProps);
    defaultLogger.info('saved payment schedule', result);
    paymentSchedule.addEvent();

    await this.eventDispatcher.dispatch(paymentSchedule);

    return resultContract;
  }

  async canExecute(identity: Identity, request?: CreateSplitContractCommand): Promise<CanExecuteResult> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.credit);
    if (roles.permissions.read === Authorization.self || roles.permissions.write === Authorization.self) {
      return CanExecuteResult.sca_needed({
        payload: request,
        actionType: 'CREATE_SPLIT_CONTRACT',
      });
    }
    return CanExecuteResult.can();
  }
}
