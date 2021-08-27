import 'reflect-metadata';
import {
  anAccountWithLoanDetails,
  anAccountWithoutLoanDetails,
  anAlgoanAccountDto,
  anAlgoanAccountDtoWithoutLoanDetails,
} from './fixtures';
import { AccountMapper } from '../adapters/mapper/AccountMapper';

describe('Test account mapper', () => {
  it('should map account from algoan account dto', () => {
    const accountMapper = new AccountMapper();
    const algoanAccountDto = anAlgoanAccountDto;

    const result = accountMapper.toDomain(algoanAccountDto);

    expect(result).toEqual(anAccountWithLoanDetails);
  });

  it('should map account from algoan account dto without loan details', () => {
    const accountMapper = new AccountMapper();
    const algoanAccountDto = anAlgoanAccountDtoWithoutLoanDetails;

    const result = accountMapper.toDomain(algoanAccountDto);

    expect(result).toEqual(anAccountWithoutLoanDetails);
  });
});
