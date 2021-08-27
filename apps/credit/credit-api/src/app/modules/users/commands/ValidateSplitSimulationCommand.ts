import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateSplitSimulationCommand {
  @IsString()
  @ApiProperty({ example: 'a24de60e-9b05-4cba-9262-aa54e09289c3', description: 'Simulation id (uuid)' })
  simulationId: string;
}
