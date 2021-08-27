import { AggregateRoot, Handle } from '@oney/ddd';
import { PartialExceptFor } from '@oney/common-core';
import { ClearingCreated, COPCreated, SDDCreated } from '@oney/payment-messages';
import { OperationType } from '../types/operation/OperationType';
import { OperationDirection } from '../types/OperationDirection';
import { OperationStatus } from '../types/operation/OperationStatus';
import { OperationProperties } from './OperationProperties';

export class Operation extends AggregateRoot<OperationProperties> {
  props: OperationProperties;

  constructor(operationProps: PartialExceptFor<OperationProperties, 'orderId'>) {
    super(operationProps.orderId);
  }

  private static isCOP(type: OperationType, status: OperationStatus): boolean {
    return (
      [OperationType.COP_IN, OperationType.COP_OUT].includes(type) &&
      [
        OperationStatus.WAITING,
        OperationStatus.CANCELLED,
        OperationStatus.EXPIRED,
        OperationStatus.FAILED,
        OperationStatus.WAITING_VALIDATION,
      ].includes(status)
    );
  }

  private static isSDD(type: OperationType): boolean {
    return [
      OperationType.SDD_IN,
      OperationType.SDD_IN_REFUND,
      OperationType.SDD_OUT,
      OperationType.SDD_OUT_REFUND,
    ].includes(type);
  }

  private static isClearing(type: OperationType, status: OperationStatus): boolean {
    return (
      [
        OperationType.COP_IN,
        OperationType.COP_IN_REFUND,
        OperationType.COP_OUT,
        OperationType.COP_OUT_REFUND,
        OperationType.ATM_OUT,
        OperationType.ATM_OUT_REFUND,
      ].includes(type) && [OperationStatus.COMPLETED, OperationStatus.REFUNDED].includes(status)
    );
  }

  static create(props: OperationProperties): Operation {
    const operation = new Operation({ orderId: props.orderId });
    const [version] = props.version;
    if (Operation.isCOP(version.type, version.status)) {
      operation.createCOP(props);
    } else if (Operation.isSDD(version.type)) {
      operation.createSDD(props);
    } else if (Operation.isClearing(version.type, version.status)) {
      operation.createClearing(props);
    }
    return operation;
  }

  private createCOP(props: OperationProperties): void {
    this.applyChange(
      new COPCreated({
        ...props,
        version: props.version.map(item => ({
          ...item,
          direction: OperationDirection[item.direction.toUpperCase()],
        })),
      }),
    );
  }

  @Handle(COPCreated)
  private applyCreateCOP(copCreated: COPCreated): void {
    this.props = {
      ...this.props,
      ...copCreated.props,
      version: copCreated.props.version.map(item => ({
        ...item,
        direction: OperationDirection[item.direction.toUpperCase()],
      })),
    };
  }

  private createClearing(props: OperationProperties): void {
    this.applyChange(
      new ClearingCreated({
        ...props,
        version: props.version.map(item => ({
          ...item,
          direction: OperationDirection[item.direction.toUpperCase()],
        })),
      }),
    );
  }

  @Handle(ClearingCreated)
  private applyCreateClearing(clearingCreated: ClearingCreated): void {
    this.props = {
      ...this.props,
      ...clearingCreated.props,
      version: clearingCreated.props.version.map(item => ({
        ...item,
        direction: OperationDirection[item.direction.toUpperCase()],
      })),
    };
  }

  private createSDD(props: OperationProperties): void {
    this.applyChange(
      new SDDCreated({
        ...props,
        version: props.version.map(item => ({
          ...item,
          direction: OperationDirection[item.direction.toUpperCase()],
        })),
      }),
    );
  }

  @Handle(SDDCreated)
  private applyCreateSDD(sddCreated: SDDCreated): void {
    this.props = {
      ...this.props,
      ...sddCreated.props,
      version: sddCreated.props.version.map(item => ({
        ...item,
        direction: OperationDirection[item.direction.toUpperCase()],
      })),
    };
  }
}
