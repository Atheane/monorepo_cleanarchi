import { Entity } from '@oney/ddd';
import { CardType } from '@oney/payment-messages';
import { CardStatus } from '../types/CardStatus';
import { UpdatableCardPreferences } from '../types/UpdatableCardPreferences';
import { CardPreferences } from '../valueobjects/card/CardPreferences';

export interface CardProperties {
  id: string;

  ownerId: string;

  ref: string;

  pan: string;

  type: CardType;

  status: CardStatus;

  hasPin: boolean;

  preferences: CardPreferences;
}

export class Card extends Entity<CardProperties> {
  readonly props: CardProperties;

  constructor(cardProps: CardProperties) {
    super(cardProps.id);
    this.props = { ...cardProps };
  }

  public get ownerId(): string {
    return this.props.ownerId;
  }

  public get ref(): string {
    return this.props.ref;
  }

  public get pan(): string {
    return this.props.pan;
  }

  public get type(): CardType {
    return this.props.type;
  }

  public get status(): CardStatus {
    return this.props.status;
  }

  public set status(value: CardStatus) {
    this.props.status = value;
  }

  public get hasPin(): boolean {
    return this.props.hasPin;
  }

  public set hasPin(value: boolean) {
    this.props.hasPin = value;
  }

  updatePreferences(preferences: UpdatableCardPreferences): void {
    this.props.preferences.updatePreferences(preferences);
  }
}
