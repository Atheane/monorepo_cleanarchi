import { X3X4EligibilityCalculated } from '@oney/cdp-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';
import { UpdateCreditor } from '../../usecases/creditors';

@injectable()
export class X3X4EligibilityCalculatedHandler extends DomainEventHandler<X3X4EligibilityCalculated> {
  private readonly usecase: UpdateCreditor;

  constructor(usecase: UpdateCreditor) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: X3X4EligibilityCalculated): Promise<void> {
    const { uId, eligibility } = domainEvent.props;
    await this.usecase.execute({ userId: uId, isEligible: eligibility });
  }
}
