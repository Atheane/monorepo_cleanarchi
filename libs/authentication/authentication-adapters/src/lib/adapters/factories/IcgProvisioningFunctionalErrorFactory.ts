import { injectable } from 'inversify';
import {
  ProvisioningFunctionalErrorFactory,
  RefAuthError,
  User,
  ProvisioningFunctionalErrorCtor,
} from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { RefAuthResponseReturnTypeCodes } from '../mappers/icg/refauth/IcgRefAuthResponseXmlMapper';

@injectable()
export class IcgProvisioningFunctionalErrorFactory implements ProvisioningFunctionalErrorFactory {
  private readonly _functionalErrors = {
    [RefAuthResponseReturnTypeCodes.ALERT]: RefAuthError.ProvisionClientFailWithAlert,
    [RefAuthResponseReturnTypeCodes.CONTRACT_EXECUTION_ERROR]:
      RefAuthError.ProvisioningClientFailWithContractExecutionError,
    [RefAuthResponseReturnTypeCodes.REQUEST_ERROR]: RefAuthError.ProvisionClientFailWithRequestError,
    [RefAuthResponseReturnTypeCodes.TECHNICAL_ERROR]: RefAuthError.ProvisionClientFailWithTechnicalError,
    default: RefAuthError.ProvisionClientFailWithUnknownCode,
  };
  private _code: string;
  private _user: User;

  build(code: string, user: User): DomainError {
    this._user = user;
    this._code = code;
    const errorCtor = !this._isFunctionalError()
      ? this._functionalErrors.default
      : this._functionalErrors[this._code];
    const error = this._buildProvisioningError(errorCtor);
    return error;
  }

  private _isFunctionalError(): boolean {
    return this._code in Object.values(RefAuthResponseReturnTypeCodes);
  }

  private _buildProvisioningError(ctor: ProvisioningFunctionalErrorCtor): DomainError {
    return ctor.name !== 'ProvisionClientFailWithUnknownCode'
      ? new ctor(this._user.props.uid)
      : new ctor(this._user.props.uid, this._code);
  }
}
