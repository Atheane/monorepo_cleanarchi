import { Mapper } from '@oney/common-core';
import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { DiligencesType, KycDiligenceApiErrorReason, KycDiligenceFailed } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { BankAccountActivationGateway } from '../domain/gateways/BankAccountActivationGateway';
import { BankAccountRepositoryRead } from '../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../domain/repository/bankAccounts/BankAccountRepositoryWrite';
import { NetworkError } from '../models/errors/PaymentErrors';
import { PaymentIdentifier } from '../PaymentIdentifier';

export interface NotifyDiligenceByAggregationToPartnerCommand {
  userId: string;
}

@injectable()
export class NotifyDiligenceByAggregationToPartner
  implements Usecase<NotifyDiligenceByAggregationToPartnerCommand, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountActivationGateway)
    private readonly bankAccountActivationGateway: BankAccountActivationGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(EventDispatcher)
    private readonly eventDispatcher: EventDispatcher,
    @inject(EventProducerDispatcher)
    private readonly eventProducerDispatcher: EventProducerDispatcher,
    @inject(SymLogger)
    private readonly logger: Logger,
    @inject(PaymentIdentifier.apiErrorReasonMapper)
    private readonly apiErrorReasonMapper: Mapper<KycDiligenceApiErrorReason>,
  ) {}
  async execute({ userId }: NotifyDiligenceByAggregationToPartnerCommand): Promise<void> {
    try {
      this.logger.info(`Starting partner complementary diligence creation for account ID ${userId}`);
      const bankAccount = await this.bankAccountRepositoryRead.findById(userId);
      this.logger.info(
        `Retrieved bank account ${bankAccount.props.uid} with diligence status: ${bankAccount.props.kycDiligenceStatus}`,
      );
      await this.bankAccountActivationGateway.createComplimentaryDiligence(userId);
      this.logger.info(`Complementary diligence successfully created`);
      bankAccount.validateKycDiligence({ diligenceType: DiligencesType.AGGREGATION });
      const { props } = await this.bankAccountRepositoryWrite.save(bankAccount);
      this.logger.info(`Updated bank account ${props.uid} diligence status to: ${props.kycDiligenceStatus}`);
      await this.eventProducerDispatcher.dispatch(bankAccount);
    } catch (error) {
      if (error instanceof NetworkError.ApiResponseError) {
        const event = new KycDiligenceFailed({
          reason: this.apiErrorReasonMapper.toDomain(error.cause.apiErrorReason),
          accountId: userId,
          type: error.message,
        });
        await this.eventDispatcher.dispatch(event);
      }

      throw error;
    }
  }
}
