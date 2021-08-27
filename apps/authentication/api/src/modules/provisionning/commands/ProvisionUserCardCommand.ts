import { IsString } from 'class-validator';

export class ProvisionUserCardCommand {
  @IsString()
  userId: string;

  @IsString()
  cardId: string;

  @IsString()
  encryptedData: string;
}
