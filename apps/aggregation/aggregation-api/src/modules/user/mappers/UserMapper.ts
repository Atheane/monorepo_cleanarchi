import { injectable } from 'inversify';
import { Mapper } from '@oney/common-core';
import { User } from '@oney/aggregation-core';
import { TransactionMapper } from './TransactionMapper';
import { IUserConsent, IUserWithCreditDecisioningData } from '../dto';

@injectable()
export class UserMapper implements Mapper<User> {
  constructor(private readonly transactionMapper: TransactionMapper) {}

  fromDomain(user: User): IUserConsent {
    const userConsentDto: IUserConsent = {
      userId: user.props.userId,
      consent: user.props.consent,
      consentDate: user.props.consentDate,
    };
    return userConsentDto;
  }
  fromDomainWithCreditDecioningData(user: User): IUserWithCreditDecisioningData {
    return {
      creditDecisioningUserId: user.props.creditDecisioningUserId,
      unsavedTransactions: user.props.unsavedTransactions.map(aTransaction =>
        this.transactionMapper.fromDomain(aTransaction),
      ),
    };
  }
}
