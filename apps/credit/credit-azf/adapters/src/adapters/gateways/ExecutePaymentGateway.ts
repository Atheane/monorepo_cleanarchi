import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import {
  PaymentGateway,
  SplitPaymentSchedule,
  SplitPaymentScheduleRepository,
} from '../../../../core/src/domain';
import { PaymentExecution, PaymentStatus } from '../../../../core/src/domain/types';
import { IAppConfiguration } from '../../di/app';
import { Identifiers } from '../../di/Identifiers';
import { PaymentExecutionMapper } from '../mappers';
import { OdbPaymentCommand, P2PReferences } from '../models';
import { OdbConnectionService } from '../services';

@injectable()
export class ExecutePaymentGateway implements PaymentGateway {
  constructor(
    @inject(Identifiers.mappers.paymentExecutionMapper)
    private readonly paymentExecutionMapper: PaymentExecutionMapper,
    @inject(Identifiers.splitPaymentScheduleRepository)
    private readonly splitPaymentScheduleRepository: SplitPaymentScheduleRepository,
    private readonly odbConnectionService: OdbConnectionService,
    @inject(Identifiers.appConfiguration)
    private readonly config: IAppConfiguration,
    @inject(EventProducerDispatcher)
    private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  private paymentExecutionValidationToAllowProcess(paymentExecution: PaymentExecution): boolean {
    const paymentExecutionDateIsValid = Date.now() >= paymentExecution.dueDate.getTime();
    const currentPaymentExecutionStatusIsTodo = paymentExecution.status === PaymentStatus.TODO;
    return paymentExecutionDateIsValid && currentPaymentExecutionStatusIsTodo;
  }

  private async executePayment(
    paymentExecution: PaymentExecution,
    paymentSchedule: SplitPaymentSchedule,
  ): Promise<PaymentExecution> {
    const { userId, contractNumber, productCode } = paymentSchedule.props;
    const matchingKey = `${productCode} ${paymentExecution.key}`;
    try {
      const refP2P = P2PReferences.find(p2p => p2p.key === matchingKey);
      const paymentToBePaid: OdbPaymentCommand = {
        ref: refP2P.ref,
        amount: paymentExecution.amount,
        message: refP2P.label,
        senderId: userId,
        contractNumber,
      };
      const paymentPaid = await this.odbConnectionService.executePayment(paymentToBePaid);
      console.log(
        `----- SUCCESS for userId:${userId}, ref:${matchingKey}, amount:${paymentExecution.amount} orderId:${paymentPaid.orderId}`,
      );
      return this.paymentExecutionMapper.toDomain({ result: paymentPaid, paymentExecution });
    } catch (e) {
      /* istanbul ignore next */
      console.log(
        `----- ERROR for userId:${userId}, contractNumber:${contractNumber}, ref:${matchingKey}, amount:${paymentExecution.amount}, error:${e?.message}.`,
        'Detailed error',
        e?.response?.data,
      );
    }
  }

  private async executeFundingPayment(paymentSchedule: SplitPaymentSchedule) {
    if (!paymentSchedule.canFundingBeExecuted()) {
      return;
    }
    const funding = paymentSchedule.getFundingExecution();
    const fundingPaid = await this.executePayment(funding, paymentSchedule);
    if (fundingPaid) {
      paymentSchedule.updateFundingExecution(fundingPaid);
    }
  }

  private async executeRefundPayments(paymentSchedule: SplitPaymentSchedule) {
    const refundPaymentsThatCouldBeExecuted = paymentSchedule.props.paymentsExecution.filter(
      this.paymentExecutionValidationToAllowProcess,
    );
    if (refundPaymentsThatCouldBeExecuted.length) {
      const preparedPaymentsRequests = refundPaymentsThatCouldBeExecuted.map(refund => {
        return this.executePayment(refund, paymentSchedule);
      });
      const refundPaymentsPaid = await Promise.all(preparedPaymentsRequests);
      const successedRefundPaymentsPaid = refundPaymentsPaid.filter(payment => payment);
      if (successedRefundPaymentsPaid) {
        paymentSchedule.updateSomePaymentExecutions(successedRefundPaymentsPaid);
      }
    }
  }

  async processPaymentSchedule(paymentSchedule: SplitPaymentSchedule): Promise<SplitPaymentSchedule> {
    await this.executeFundingPayment(paymentSchedule);
    await this.executeRefundPayments(paymentSchedule);
    return this.splitPaymentScheduleRepository.save(paymentSchedule);
  }

  async processPaymentSchedulesByUser(
    paymentSchedules: SplitPaymentSchedule[],
  ): Promise<SplitPaymentSchedule[]> {
    const preparedPaymentScheduleProcesses = paymentSchedules.map(paymentSchedule =>
      this.processPaymentSchedule(paymentSchedule),
    );
    const paymentSchedulesProcessed = await Promise.all(preparedPaymentScheduleProcesses);
    await this.dispatchEventsForEachSchedule(paymentSchedules);
    return paymentSchedulesProcessed;
  }

  private async dispatchEventsForEachSchedule(schedulesOwnedByUSer: SplitPaymentSchedule[]) {
    return Promise.allSettled(
      schedulesOwnedByUSer.map(async schedule => {
        const scheduleHasEvents = schedule.events.length !== 0;
        if (scheduleHasEvents) {
          console.log(
            `dispatching events after payment schedule process for aggregate id: ${schedule.props.id}`,
          );
          await this.eventDispatcher.dispatch(schedule);
        }
      }),
    );
  }
}
