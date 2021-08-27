import { CardStatus } from '@oney/payment-core';
import { SmoneyCardStatusMapper } from '../../adapters/mappers/common/SmoneyCardStatusMapper';

function SmoneyCardStatusMapperFactory() {
  return new SmoneyCardStatusMapper();
}

describe('SmoneyCardStatusMapper.unit.test', () => {
  test.each([
    [0, CardStatus.ORDERED],
    [1, CardStatus.SENT],
    [2, CardStatus.ACTIVATED],
    [3, CardStatus.EXPIRED],
    [4, CardStatus.OPPOSED],
    [5, CardStatus.FAILED],
    [6, CardStatus.DEACTIVATED],
    [7, CardStatus.CANCELLED],
    [3712, null],
  ])('.toDomain(%o)', (input, expected) => {
    const mapper = SmoneyCardStatusMapperFactory();

    const result = mapper.toDomain(input);

    expect(result).toBe(expected);
  });

  test.each([
    [CardStatus.ORDERED, 0],
    [CardStatus.SENT, 1],
    [CardStatus.ACTIVATED, 2],
    [CardStatus.EXPIRED, 3],
    [CardStatus.OPPOSED, 4],
    [CardStatus.FAILED, 5],
    [CardStatus.DEACTIVATED, 6],
    [CardStatus.CANCELLED, 7],
    [CardStatus[3712], null],
  ])('.toDomain(%o)', (input, expected) => {
    const mapper = SmoneyCardStatusMapperFactory();

    const result = mapper.fromDomain(input);

    expect(result).toBe(expected);
  });
});
