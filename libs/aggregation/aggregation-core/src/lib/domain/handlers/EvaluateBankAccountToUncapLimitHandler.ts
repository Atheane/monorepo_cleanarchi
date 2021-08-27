import { DomainEventHandler } from '@oney/ddd';
import { EvaluateBankAccountToUncapLimits } from '@oney/payment-messages';
import { injectable } from 'inversify';
import {
  UploadUserDataToCreditDecisioningPartner,
  UploadUserDataCommand,
} from '../../usecases/users/UploadUserDataToCreditDecisioningPartner';

@injectable()
export class EvaluateBankAccountToUncapLimitsHandler extends DomainEventHandler<
  EvaluateBankAccountToUncapLimits
> {
  private readonly usecase: UploadUserDataToCreditDecisioningPartner;

  constructor(usecase: UploadUserDataToCreditDecisioningPartner) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: EvaluateBankAccountToUncapLimits): Promise<void> {
    const { uid } = domainEvent.props;
    console.log(`Received EVALUATE_BANK_ACCOUNT_TO_UNCAP_LIMITS for userId ${uid}`);
    const uploadCommand: UploadUserDataCommand = {
      userId: uid,
    };

    await this.usecase.execute(uploadCommand);
  }
}
