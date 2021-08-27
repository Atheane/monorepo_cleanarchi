import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class StartRaisingLimitsWorkflow {
  @Expose()
  @IsString()
  uid: string;

  static setProperties(cmd: StartRaisingLimitsWorkflow): StartRaisingLimitsWorkflow {
    return plainToClass(StartRaisingLimitsWorkflow, cmd, { excludeExtraneousValues: true });
  }
}
