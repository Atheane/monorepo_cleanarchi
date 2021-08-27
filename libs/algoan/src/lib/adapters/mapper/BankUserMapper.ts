import { injectable } from 'inversify';
import { BankUser } from '../../domain/models/BankUser';
import { AlgoanBankUserDto } from '../models/AlgoanBankUserDto';

@injectable()
export class BankUserMapper {
  toDomain(algoanBankUserDto: AlgoanBankUserDto): BankUser {
    return {
      id: algoanBankUserDto.id,
      adenTriggers: algoanBankUserDto.adenTriggers,
      status: algoanBankUserDto.status,
    } as BankUser;
  }
}
