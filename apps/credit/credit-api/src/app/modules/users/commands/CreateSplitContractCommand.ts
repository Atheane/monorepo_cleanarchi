import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSplitContractCommand {
  @IsString()
  @ApiProperty({ example: '2744d81f-10a3-45e9-b887-bd88bbd54692', description: 'Simulation id' })
  simulationId: string;

  @IsString()
  @ApiProperty({ example: '1380', description: 'Bank account id (SMoney id)' })
  bankAccountId: string;
}
