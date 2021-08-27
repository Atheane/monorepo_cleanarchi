import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DocumentSide, DocumentType } from '@oney/profile-core';
import { CountryCode } from '@oney/profile-messages';

/* TODO : Ensure to migrate this logic
    documentSide: Joi.string().when('documentType', {
      is: ['id', 'residence_permit_before_2011', 'residence_permit_after_2011'],
      then: Joi.string()
        .valid('front', 'back')
        .required(),
      otherwise: Joi.string().forbidden(),
 */

export class IdentityDocumentCommand {
  @Expose()
  @IsString()
  @IsOptional()
  documentSide?: DocumentSide;

  @Expose()
  @IsString()
  documentType: DocumentType;

  @Expose()
  @IsString()
  nationality: CountryCode;

  static setProperties(cmd: IdentityDocumentCommand): IdentityDocumentCommand {
    return plainToClass(IdentityDocumentCommand, cmd, { excludeExtraneousValues: true });
  }
}
