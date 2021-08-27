import { Mapper } from '@oney/common-core';
import { CardStatus } from '@oney/payment-core';

export class SmoneyCardStatusMapper implements Mapper<CardStatus, number> {
  toDomain(status: number): CardStatus {
    switch (status) {
      case 0:
        return CardStatus.ORDERED;
      case 1:
        return CardStatus.SENT;
      case 2:
        return CardStatus.ACTIVATED;
      case 3:
        return CardStatus.EXPIRED;
      case 4:
        return CardStatus.OPPOSED;
      case 5:
        return CardStatus.FAILED;
      case 6:
        return CardStatus.DEACTIVATED;
      case 7:
        return CardStatus.CANCELLED;
    }

    return null;
  }

  fromDomain(status: CardStatus): number {
    switch (status) {
      case CardStatus.ORDERED:
        return 0;
      case CardStatus.SENT:
        return 1;
      case CardStatus.ACTIVATED:
        return 2;
      case CardStatus.EXPIRED:
        return 3;
      case CardStatus.OPPOSED:
        return 4;
      case CardStatus.FAILED:
        return 5;
      case CardStatus.DEACTIVATED:
        return 6;
      case CardStatus.CANCELLED:
        return 7;
    }

    return null;
  }
}
