import { SplitPaymentScheduleCreatedProperties, SplitProduct } from '@oney/credit-messages';
import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { injectable, inject } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';

@injectable()
export class GeneratePaymentSchedule implements Usecase<SplitPaymentScheduleCreatedProperties, {}> {
  constructor(
    @inject(Identifiers.ProcessNotificationI)
    private readonly processNotificationI: ProcessNotificationI,
  ) {}

  async execute(paymentScheduleProperties: SplitPaymentScheduleCreatedProperties): Promise<DataSendType> {
    try {
      //payload construction
      const totalAmountFinancing = paymentScheduleProperties.paymentsExecution
        .filter(p => p.key !== 'fee')
        .map(p => p.amount)
        .reduce((acc, amount) => acc + amount);

      const totalPaymentFees = paymentScheduleProperties.paymentsExecution
        .filter(p => p.key === 'fee')
        .map(p => p.amount)
        .reduce((acc, amount) => acc + amount);

      const totalPayment = totalPaymentFees + totalAmountFinancing;

      const payload = {
        ...paymentScheduleProperties,
        splitProduct: SplitProduct,
        totalAmountFinancing: parseFloat(totalAmountFinancing.toFixed(2)),
        totalPaymentFees: parseFloat(totalPaymentFees.toFixed(2)),
        total: parseFloat(totalPayment.toFixed(2)),
        percentage: `${(totalAmountFinancing * 100) / totalPayment}%`,
        apr: parseFloat((paymentScheduleProperties.apr * 100).toFixed(2)),
      };

      //build settings
      const settings = {
        contentBodyPath: `paymentSchedule/pdf.fr.paymentSchedule.html`,
        contentFooterPath: `pdf.fr.footer.html`,
        path: `${paymentScheduleProperties.userId}/payment schedule/${paymentScheduleProperties.bankAccountId}/${paymentScheduleProperties.contractNumber}.pdf`,
        pdfOptions: {
          marginBottom: '2cm',
          enableSmartShrinking: true,
          marginLeft: 20,
          marginRight: 20,
        },
        channel: ChannelEnum.PDF,
      };

      return this.processNotificationI.processNotification(payload, settings);
    } catch (error) {
      defaultLogger.error('@oney/notification.GeneratePaymentSchedule.execute.catch', error);
      throw error;
    }
  }
}
