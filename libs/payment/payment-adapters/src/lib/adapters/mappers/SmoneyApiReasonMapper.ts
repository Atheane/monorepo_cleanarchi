import { Mapper } from '@oney/common-core';
import { KycDiligenceApiErrorReason } from '@oney/payment-messages';
import { injectable } from 'inversify';

export interface SmoneyApiErrorData {
  Code: number;
  ErrorMessage: string;
  Title: string;
  Priority: number;
}

@injectable()
export class SmoneyApiReasonMapper implements Mapper<KycDiligenceApiErrorReason> {
  toDomain(raw: SmoneyApiErrorData): KycDiligenceApiErrorReason {
    const { Code, ErrorMessage, Title, Priority } = raw;
    return {
      code: Code,
      errorMessage: ErrorMessage,
      title: Title,
      priority: Priority,
    };
  }
}
