import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetTermsQuery {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '273RHCQLfy', description: 'Contract number' })
  contractNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '20201111', description: 'Version terms' })
  versionNumber: string;
}
