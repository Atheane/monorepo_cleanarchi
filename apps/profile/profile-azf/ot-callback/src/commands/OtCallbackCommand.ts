import { KycDecisionType, KycFraudType } from '@oney/profile-core';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OtCallbackCommand {
  @Expose()
  @IsString()
  caseReference: string;

  @Expose()
  @IsString()
  decision: KycDecisionType;

  @Expose()
  @IsNumber()
  @IsOptional()
  caseId: number;

  @Expose()
  @IsOptional()
  // Needed for now as OT spec is not equal with the real payload
  caseScore?: string | number;

  @Expose()
  @IsOptional()
  // Needed for now as OT spec is not equal with the real payload
  caseStateId?: string | number;

  @Expose()
  @IsString()
  @IsOptional()
  caseState?: string;

  @Expose()
  @IsString()
  @IsOptional()
  subResult_aml_sanctions?: KycDecisionType;

  @Expose()
  @IsString()
  @IsOptional()
  subResult_aml_pep?: KycDecisionType;

  @Expose()
  @IsString()
  @IsOptional()
  subResult_bdf?: KycDecisionType;

  @Expose()
  @IsString()
  @IsOptional()
  subResult_fraud?: KycFraudType;

  @Expose()
  @IsString()
  @IsOptional()
  subResult_compliance?: KycDecisionType;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: OtCallbackCommand): OtCallbackCommand {
    if (typeof cmd.caseScore === 'string') {
      cmd.caseScore = parseInt(cmd.caseScore, 10);
    }
    return plainToClass(OtCallbackCommand, cmd, { excludeExtraneousValues: true });
  }
}
