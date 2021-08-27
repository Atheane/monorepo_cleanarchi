import { Entity } from '@oney/ddd';
import * as deepEqual from 'deep-equal';
import { Collection } from './Collection';

export enum DebtStatus {
  PENDING = 'PENDING',
  LOST = 'LOST',
  RECOVERED = 'RECOVERED',
}

export interface DebtProperties {
  id: string;
  userId: string;
  date: Date;
  debtAmount: number;
  remainingDebtAmount: number;
  status: DebtStatus;
  reason: string;
  collections: Collection[];
}

export class Debt extends Entity<DebtProperties> {
  readonly props: DebtProperties;

  constructor(debtProperties: DebtProperties) {
    super(debtProperties.id);
    this.props = { ...debtProperties };
    if (!debtProperties.collections || !debtProperties.collections.length) {
      this.props.collections = [];
    } else {
      this.props.collections = this.props.collections.map(collection => new Collection(collection.props));
    }
  }

  equals(debt: Debt): boolean {
    return super.equals(debt) && deepEqual(this, debt);
  }

  close(): void {
    this.props.status = DebtStatus.RECOVERED;
  }

  isClosed(): boolean {
    return this.props.status === DebtStatus.RECOVERED && this.props.remainingDebtAmount === 0;
  }

  isFullyCollected(): boolean {
    return this.props.remainingDebtAmount <= 0;
  }

  canBeFullyCollected(amountOfCollection: number): boolean {
    return this.props.remainingDebtAmount - amountOfCollection <= 0;
  }

  getCollectionTransferOrderId(): string {
    const ORDER_ID_PREFIX = 'I';
    const COLLECTION_ATTEMP_NUMBER_PREFIX = '000';
    const COLLECTION_ATTEMP_NUMBER_INCREMENT = 1;
    const COLLECTION_ATTEMP_CODE_CHARACTERS = 4;

    const orderIdThatCreatedTheDebt = this.props.id;
    const collectionAttempNumber = this.props.collections.length + COLLECTION_ATTEMP_NUMBER_INCREMENT;

    let collectionAttempCode = `${COLLECTION_ATTEMP_NUMBER_PREFIX}${collectionAttempNumber}`;
    collectionAttempCode = collectionAttempCode.substr(
      collectionAttempCode.length - COLLECTION_ATTEMP_CODE_CHARACTERS,
    );

    return `${ORDER_ID_PREFIX}${orderIdThatCreatedTheDebt}${collectionAttempCode}`;
  }

  updateRemainingAmount(amount: number): void {
    this.props.remainingDebtAmount = amount;
  }

  addCollection(collection: Collection): void {
    this.props.collections = this.props.collections.concat(collection);
  }
}
