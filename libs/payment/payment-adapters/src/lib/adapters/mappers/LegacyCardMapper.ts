import { Mapper } from '@oney/common-core';
import { Card, CardPreferences, CardStatus, LegacyCard } from '@oney/payment-core';
import { CardType } from '@oney/payment-messages';

export class LegacyCardMapper implements Mapper<Card, LegacyCard> {
  fromDomain(card: Card): LegacyCard {
    let status;

    switch (card.status) {
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case CardStatus.ORDERED:
        status = 0;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case CardStatus.SENT:
        status = 1;
        break;
      case CardStatus.ACTIVATED:
        status = 2;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case CardStatus.EXPIRED:
        status = 3;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case CardStatus.OPPOSED:
        status = 4;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case CardStatus.FAILED:
        status = 5;
        break;
    }

    let cardType = null;
    switch (card.type) {
      case CardType.PHYSICAL_CLASSIC:
        cardType = 2;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case CardType.PHYSICAL_PREMIER:
        cardType = 4;
        break;
    }
    return {
      cid: card.id,
      uniqueId: card.ref,
      pan: card.pan,
      status,
      cardType,
      hasPin: card.hasPin,
      blocked: card.props.preferences.blocked,
      foreignPayment: card.props.preferences.foreignPayment,
      internetPayment: card.props.preferences.internetPayment,
      atmWeeklyAllowance: card.props.preferences.atmWeeklyAllowance,
      atmWeeklyUsedAllowance: card.props.preferences.atmWeeklyUsedAllowance,
      monthlyAllowance: card.props.preferences.monthlyAllowance,
      monthlyUsedAllowance: card.props.preferences.monthlyUsedAllowance,
    };
  }

  toDomain(raw: LegacyCard & { uid: string }): Card {
    let status;

    switch (raw.status) {
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case 0:
        status = CardStatus.ORDERED;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case 1:
        status = CardStatus.SENT;
        break;
      case 2:
        status = CardStatus.ACTIVATED;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case 3:
        status = CardStatus.EXPIRED;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case 4:
        status = CardStatus.OPPOSED;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case 5:
        status = CardStatus.FAILED;
        break;
    }

    let cardType = null;
    switch (raw.cardType) {
      case 2:
        cardType = CardType.PHYSICAL_CLASSIC;
        break;
      /* istanbul ignore next: Not covered because this branch are not important to test the whole logic */
      case 4:
        cardType = CardType.PHYSICAL_PREMIER;
        break;
    }

    return new Card({
      id: raw.cid,
      hasPin: raw.hasPin,
      type: cardType,
      ownerId: raw.uid,
      status,
      ref: raw.uniqueId,
      pan: raw.pan,
      preferences: new CardPreferences({
        atmWeeklyAllowance: raw.atmWeeklyAllowance,
        blocked: raw.blocked,
        foreignPayment: raw.foreignPayment,
        internetPayment: raw.internetPayment,
        monthlyUsedAllowance: raw.monthlyUsedAllowance,
        monthlyAllowance: raw.monthlyAllowance,
        atmWeeklyUsedAllowance: raw.atmWeeklyUsedAllowance,
      }),
    });
  }
}
