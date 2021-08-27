import { Logger, SymLogger } from '@oney/logger-core';
import { NetworkProvider, PaymentRepositoryWrite, Transfer, P2PErrors } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { SmoneyPaymentMapper } from '../../mappers/SmoneyPaymentMapper';
import { SmoneyApi } from '../../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class SmoneyP2PRepository implements PaymentRepositoryWrite {
  constructor(
    private readonly _networkProvider: NetworkProvider<SmoneyApi>,
    @inject(SymLogger) private readonly logger: Logger,
  ) {}

  async create(senderUid: string, beneficiaryUid: string, payment: Transfer): Promise<Transfer> {
    const paymentRequest = new SmoneyPaymentMapper().fromDomain(payment);

    this.logger.info('Sending P2P request:', paymentRequest);
    try {
      await this._networkProvider.api().smoneyPaymentApi.createPayment({
        ...paymentRequest,
        sender: { appaccountid: senderUid },
        beneficiary: { appaccountid: beneficiaryUid },
      });

      return payment;
    } catch (err) {
      this.logger.info('Error while creating P2P:', err);

      if (!err.cause || !err.cause.apiErrorReason || !err.cause.apiErrorReason.Code) {
        throw new P2PErrors.UnknownError();
      }

      const errorCode = err.cause.apiErrorReason.Code;
      switch (errorCode) {
        case 362:
          throw new P2PErrors.NotAuthorized();
        case 569:
          throw new P2PErrors.TokenExpired();
        case 570:
          throw new P2PErrors.InvalidToken();
        case 704:
          throw new P2PErrors.MissingParameters();
        case 177:
        case 715:
          throw new P2PErrors.BadParameters();
        case 147:
          throw new P2PErrors.SenderDoesNotExist();
        case 500:
          throw new P2PErrors.SenderAccountBlocked();
        case 111:
          throw new P2PErrors.SenderCantCreateP2P();
        case 127:
          throw new P2PErrors.CantSendToYourself();
        case 345:
        case 112:
          throw new P2PErrors.IncompleteBeneficiary();
        case 110:
          throw new P2PErrors.InsufficientBalance();
        case 701:
          throw new P2PErrors.NonBankCustomerOperationsLimitsReached();
        case 702:
          throw new P2PErrors.UncappedCustomerOperationsLimitsReached();
        case 703:
          throw new P2PErrors.CappedCustomerOperationsLimitsReached();
        case 710:
          throw new P2PErrors.P2PAlreadyExists();
        case 149:
          throw new P2PErrors.CustomerOperationsLimitsReached();
        case 343:
          throw new P2PErrors.AnnualLimitReached();
        default:
          throw new P2PErrors.UnknownError();
      }
    }
  }
}
