import { CardType } from '@oney/payment-messages';
import { SmoneyCardTypeMapper } from '../../adapters/mappers/common/SmoneyCardTypeMapper';

function SmoneyCardTypeMapperFactory() {
  return new SmoneyCardTypeMapper();
}

describe('SmoneyCardStatusMapper.unit.test', () => {
  test.each([
    [2, CardType.PHYSICAL_CLASSIC],
    [4, CardType.PHYSICAL_PREMIER],
    [3712, null],
  ])('.toDomain(%o)', (input, expected) => {
    const mapper = SmoneyCardTypeMapperFactory();

    const result = mapper.toDomain(input);

    expect(result).toBe(expected);
  });

  test.each([
    [CardType.PHYSICAL_CLASSIC, 2],
    [CardType.PHYSICAL_PREMIER, 4],
    [CardType[3712], null],
  ])('.fromDomain(%o)', (input, expected) => {
    const mapper = SmoneyCardTypeMapperFactory();

    const result = mapper.fromDomain(input);

    expect(result).toBe(expected);
  });
});
