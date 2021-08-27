import 'reflect-metadata';
import { DomainEvent } from '../domain/entities/DomainEvent';
import { AggregateRoot } from '../domain/entities/AggregateRoot';
import { Handle } from '../domain/decorators/Handle';

export interface SampleProps {
  chalom?: string;
}
export class SampleChalomUpdated implements DomainEvent<SampleProps> {
  public id: string;
  public props: SampleProps;
  constructor(props: SampleProps) {
    this.id = '1615';
    this.props = props;
  }
}
export class SampleChalomCleaned implements DomainEvent<any> {
  public id: string;
  public props: any;
  constructor() {
    this.id = '1615';
  }
}

export class Sample extends AggregateRoot<SampleProps> {
  props: SampleProps;
  constructor() {
    super('efsfsdr');
    this.props = {};
  }
  UpdateChalom(value: string) {
    this.applyChange(new SampleChalomUpdated({ chalom: value }));
  }
  CleanChalom() {
    this.applyChange(new SampleChalomCleaned());
  }
  @Handle(SampleChalomUpdated)
  applyChalomUpdated(event: SampleChalomUpdated) {
    this.props = event.props;
  }
  @Handle(SampleChalomCleaned)
  applyChalomCleaned() {
    this.props.chalom = undefined;
  }
}

describe('AggregateRoot EventSourcing', () => {
  it('sandbox', () => {
    const sample = new Sample();
    const expected = 'beau gosse';
    sample.UpdateChalom(expected);
    expect(sample.version).toEqual(1);
    expect(sample.props.chalom).toBe(expected);
    sample.CleanChalom();
    expect(sample.version).toEqual(2);
    expect(sample.props.chalom).toBeUndefined();
  });
});
