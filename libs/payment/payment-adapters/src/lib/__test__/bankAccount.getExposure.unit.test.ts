import { mockedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';

describe('BankAccount getExposure method', () => {
  it('should return exposition amount = 4380 when bankaccount balance is 1500 euros', () => {
    const expectedExpositionAmount = 4380;
    const exposure = mockedBankAccount.calculateExposure({
      balance: 1500,
      maxFeeAmountOfSplitPayment: 30,
      feeRateOfSplitPayment: 0.022,
      minPurchaseAmountToAllowSplitPayment: 1,
    });

    expect(exposure.amount).toBe(expectedExpositionAmount);
  });

  it('should return exposition amount = 291.2 when bankaccount balance is 108.8 euros', () => {
    const expectedExpositionAmount = 291.2;
    const exposure = mockedBankAccount.calculateExposure({
      balance: 108.8,
      maxFeeAmountOfSplitPayment: 30,
      feeRateOfSplitPayment: 0.022,
      minPurchaseAmountToAllowSplitPayment: 1,
    });

    expect(exposure.amount).toBe(expectedExpositionAmount);
  });

  it('should return exposition amount = 0 when bankaccount balance is 0.2 euros', () => {
    const expectedExpositionAmount = 0;
    const exposure = mockedBankAccount.calculateExposure({
      balance: 0.2,
      maxFeeAmountOfSplitPayment: 30,
      feeRateOfSplitPayment: 0.022,
      minPurchaseAmountToAllowSplitPayment: 1,
    });

    expect(exposure.amount).toEqual(expectedExpositionAmount);
  });
});
