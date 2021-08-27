import { ValueObject } from '../domain/entities/ValueObject';

describe('ValueObject', () => {
  it('a simple ValueObject should work', () => {
    class SimpleValueObject extends ValueObject<string> {
      static create(input: string) {
        return new SimpleValueObject(input);
      }
    }

    const simpleValueObject1 = SimpleValueObject.create('3712');
    const simpleValueObject2 = SimpleValueObject.create('3712');

    const equality = simpleValueObject1.equals(simpleValueObject2);

    expect(equality).toBe(true);
  });
});
