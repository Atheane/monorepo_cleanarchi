import { KycDecisionType, KycFraudType } from '@oney/profile-core';
import { OtCallbackCommand } from '../../src/commands/OtCallbackCommand';

export const otCallbackPayload: OtCallbackCommand = {
  caseId: 46027,
  caseReference: 'SP_202118_ujHGEuTJO_0YOY0Whiv',
  caseScore: '123',
  caseStateId: 4100,
  caseState: 'ANALYZED_FULL',
  decision: 'PENDING_REVIEW' as KycDecisionType,
  subResult_fraud: 'RISK_HIGH' as KycFraudType,
  subResult_aml_sanctions: ' ' as KycDecisionType,
  subResult_aml_pep: ' ' as KycDecisionType,
  subResult_bdf: ' ' as KycDecisionType,
  subResult_compliance: ' ' as KycDecisionType,
};
