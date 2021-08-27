import { DomainEventHandler } from '@oney/ddd';
import { KycGateway, PaymentIdentifier, SendKycDocument } from '@oney/payment-core';
import { KycDecisionType, UserKycDecisionUpdated } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class UserKycDecisionUpdatedEventHandler extends DomainEventHandler<UserKycDecisionUpdated> {
  private readonly handlerName: string;

  constructor(
    @inject(SendKycDocument)
    private readonly _sendKycDocument: SendKycDocument,
    @inject(PaymentIdentifier.kycGateway)
    private readonly _kycGateway: KycGateway,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle(domainEvent: UserKycDecisionUpdated): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: ${domainEvent}`);

    const { aggregateId } = domainEvent.metadata;
    const authorizedDecisionToSendDocument = [KycDecisionType.OK, KycDecisionType.OK_MANUAL];
    const authorizedDecisionToSendFilters = [
      KycDecisionType.OK,
      KycDecisionType.OK_MANUAL,
      KycDecisionType.KO_MANUAL,
    ];

    this.logger.info(
      `USER_KYC_DECISION_UPDATED // handling event with payload ${JSON.stringify(domainEvent)}`,
    );

    /* istanbul ignore else */
    if (authorizedDecisionToSendDocument.includes(domainEvent.props.kyc.decision)) {
      this.logger.info(`${this.handlerName}: executing SendKycDocument usecase for user: ${aggregateId}`);
      await this._sendKycDocument.execute({ uid: aggregateId, documents: domainEvent.props.documents });
    }

    /* istanbul ignore else */
    if (
      authorizedDecisionToSendFilters.includes(domainEvent.props.kyc.politicallyExposed) &&
      authorizedDecisionToSendFilters.includes(domainEvent.props.kyc.sanctioned)
    ) {
      this.logger.info(
        `${this.handlerName}: executing kyc setFilter for uid: ${aggregateId} using : ${domainEvent.props.kyc}`,
      );
      await this._kycGateway.setFilters({
        uid: aggregateId,
        kycValues: domainEvent.props.kyc,
      });
      this.logger.info(
        `USER_KYC_DECISION_UPDATED // Sending filters to S-Money for uid ${aggregateId} with value ${JSON.stringify(
          domainEvent.props.kyc,
        )}`,
      );
    }
  }
}
