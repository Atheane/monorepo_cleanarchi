import { plainToClass, Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class SaveUserConsentCommand {
  @Expose()
  @IsBoolean()
  consent: boolean;
  /**
     * We set the property with classTransformer in order to choose
     what value we want to expose with the outside world and above all control what output value we received.
        */
  static setProperties(cmd: SaveUserConsentCommand): SaveUserConsentCommand {
    return plainToClass(SaveUserConsentCommand, cmd, { excludeExtraneousValues: true });
  }
}
