import {
  AuthIdentifier,
  AuthRequestGenerator,
  AuthRequestHandler,
  CardProvisioningGateway,
  EventSteps,
  GeneratedConsultRequest,
  GeneratedProvisionRequest,
  PhoneProvisioningGateway,
  User,
  UserData,
  UserUid,
  GetProfileInformationGateway,
  Provisioning,
  ProvisioningStep,
} from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable, unmanaged } from 'inversify';
import { RefAuthResponseReturnTypeCodes } from '../../../mappers/icg/refauth/IcgRefAuthResponseXmlMapper';

@injectable()
export class IcgProvisioningGateway implements PhoneProvisioningGateway, CardProvisioningGateway {
  constructor(
    @inject(AuthIdentifier.provisioningRequestGenerator)
    private readonly _provisioningRequestGenerator: AuthRequestGenerator<UserData, GeneratedProvisionRequest>,
    @inject(AuthIdentifier.consultRequestGenerator)
    private readonly _consultRequestGenerator: AuthRequestGenerator<UserUid, GeneratedConsultRequest>,
    @inject(AuthIdentifier.authRequestHandler)
    private readonly _authRequestHandler: AuthRequestHandler,
    @inject(SymLogger) private readonly _logger: Logger,
    @inject(AuthIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
    @unmanaged() private readonly _odbCompanyCode: string,
  ) {}

  ////////////////////////////////////////
  // REGISTER PHONE
  ////////////////////////////////////////

  async registerPhone(user: User): Promise<void> {
    const phoneProvisiongRequestPayload = await this._generateProvisioningRequest(user);
    const parsedResponsePayload = await this._executeProvisioningRequest(phoneProvisiongRequestPayload);
    const { code, codeName } = await this._extractResponseCodeAttributes(parsedResponsePayload);
    if (this._isErrorResponse(code)) return this._processProvisioningErrorResponse(code, codeName, user);
  }

  private async _generateProvisioningRequest(user: User): Promise<string> {
    const provisionContext = { user, step: EventSteps.PHONE };
    const { provisionRequest } = await this._provisioningRequestGenerator.generate(provisionContext);
    this._logger.info(`[${user.props.uid}] Generated phone provisioning SOAP request: ${provisionRequest}`);
    const consultContext = { uid: user.props.uid };
    const { consultRequest } = await this._consultRequestGenerator.generate(consultContext);
    this._logger.info(`[${user.props.uid}] Generated consult SOAP request: ${consultRequest}`);
    return provisionRequest;
  }

  private async _extractResponseCodeAttributes(
    parsedResponsePayload: object,
  ): Promise<{ code: string; codeName: string }> {
    const code =
      parsedResponsePayload['soap:Envelope']['soap:Body'][0]['ns2:provisionnerClientResponse'][0]
        .RepnEnrlClnt[0].BlocRetr[0].CdTypeRetr[0];
    const found = Object.entries(RefAuthResponseReturnTypeCodes).find(([, value]) => value === code);
    const codeName = found ? found[0] : 'no code name';
    this._logger.info(`Phone provisioning response code in use case : ${code} (${codeName})`);
    return { code, codeName };
  }

  private async _executeProvisioningRequest(provisiongRequestPayload: string): Promise<object> {
    const requestContext = { provisionRequest: provisiongRequestPayload };
    const { authResponse: parsedAuthResponse } = await this._authRequestHandler.handleRequest(requestContext);
    const parsedAuthResponseStr = JSON.stringify(parsedAuthResponse);
    this._logger.info(`Parsed phone provisioning SOAP response: ${parsedAuthResponseStr}`);
    return parsedAuthResponse;
  }

  private _processProvisioningErrorResponse(code: string, codeName: string, user: User): never {
    const error = new DomainError(`provision error code ${codeName}`);
    error.cause = { user, code, codeName };
    throw error;
  }

  private _isErrorResponse(code: string): boolean {
    return code !== RefAuthResponseReturnTypeCodes.OK;
  }

  ////////////////////////////////////////
  // REGISTER CARD
  ////////////////////////////////////////

  async registerCard(user: User): Promise<User> {
    user = await this._verifyPhoneProvisioningStatus(user);
    const { hashedPan: lastHashedPan } = user.props.hashedCardPans.slice(-1).pop();
    const responseCode = await this._processCardProvisioning(lastHashedPan, user);
    if (this._isProvisionFail(responseCode)) this._throwProvisioningResponseError(responseCode);
    return user;
  }

  private _isProvisionFail(code: string): boolean {
    return code !== RefAuthResponseReturnTypeCodes.OK;
  }

  private _throwProvisioningResponseError(responseCode: string): never {
    const e = new DomainError(`Card provisioning error response code ${responseCode}`);
    e.cause = { errorResponse: true };
    e.code = responseCode;
    throw e;
  }

  private async _verifyPhoneProvisioningStatus(user: User): Promise<User> {
    const parsedResponseBodyNode = await this._consultProvisioningStatus(user);
    if (this._containsUserNotExistErrorMessageInside(parsedResponseBodyNode))
      return await this._handleNotProvisioned(user);
    return await this._handleAlreadyProvisioned(user, parsedResponseBodyNode);
  }

  private async _consultProvisioningStatus(user: User): Promise<object> {
    const uid = user.props.uid;
    const { consultRequest } = await this._consultRequestGenerator.generate({ uid });
    this._logger.info(`[${uid}] Consult request to check if user provisioned with phone: ${consultRequest}`);
    const requestContext = { provisionRequest: consultRequest };
    const { authResponse: parsedConsultRes } = await this._authRequestHandler.handleRequest(requestContext);
    this._logger.info(`[${uid}] Consult response parsed: ${JSON.stringify(parsedConsultRes)}`);
    const parsedConsultUserResponseBodyNode: object =
      parsedConsultRes['soap:Envelope']['soap:Body'][0]['ns2:consulterClientResponse'][0]['RepnCnsltClnt'][0];
    const parsedConsultUserResponseBodyNodeStr = JSON.stringify(parsedConsultUserResponseBodyNode);
    this._logger.info(`[${uid}] parsed consult response body node: ${parsedConsultUserResponseBodyNodeStr}`);
    return parsedConsultUserResponseBodyNode;
  }

  private _containsUserNotExistErrorMessageInside(bodyNode: object): boolean {
    const errorMessageBlock = bodyNode['BlocRetr'][0]['BlocMess'] || [];
    const hasErrorMessageBlock = !!errorMessageBlock[0];
    const userNotExistErrorMessage = 'GetUserInfoResponse/UserInfo vide';
    const includesUserErrorMessage =
      hasErrorMessageBlock &&
      errorMessageBlock[0]['ListMess'].some(({ LbMess }) => LbMess[0] === userNotExistErrorMessage);
    return hasErrorMessageBlock && includesUserErrorMessage;
  }

  private async _handleNotProvisioned(user: User): Promise<User> {
    const uid = user.props.uid;
    this._logger.info(`[${uid}] User is not provisioned on authentication partner`);
    this._logger.info(`[${uid}] User before catch up provisioning phone on partner: ${user}`);
    const provisionedUser = await this._catchUpPhoneProvisioning(user);
    this._logger.info(`[${uid}] User after catch up provisioning phone on partner: ${provisionedUser}`);
    return provisionedUser;
  }

  private async _handleAlreadyProvisioned(user: User, bodyNode: object): Promise<User> {
    const uid = user.props.uid;
    this._logger.info(`[${uid}] Entering case where user is provisioned on auth partner`);
    this._logger.info(`[${uid}] Checking if user has phone provisioned on auth partner`);
    if (this._userHasPhoneAlreadyProvisionned(bodyNode)) {
      return await this._handlePhoneAlreadyProvisionned(user);
    }
    this._logger.info(`[${uid}] User is already provisioned on auth partner but no phone provisionned`);
    // attempt to provision the phone of the existing user on auth partner
    return await this._catchUpPhoneProvisioning(user);
  }

  private _userHasPhoneAlreadyProvisionned(bodyNode: object): boolean {
    const otpSmsAuth = '1';
    const userAuthMethods: any[] = bodyNode['ListMoyeClnt'] || [];
    const isPhoneAlreadyProvisionned = userAuthMethods.some(
      authMethod => authMethod.CdTypeMoyeAuth[0] === otpSmsAuth,
    );
    return isPhoneAlreadyProvisionned;
  }

  private async _handlePhoneAlreadyProvisionned(user: User): Promise<User> {
    this._logger.info(`[${user.props.uid}] User already has a phone provisioned on auth partner`);
    const isLegacyUser = !user.props.provisioning?.phone;
    if (isLegacyUser) return await this._populateMissingData(user);
    return user;
  }

  private async _populateMissingData(user: User): Promise<User> {
    const phone = await this._getPhoneNumber(user);
    const phoneProvisioning = Provisioning.from({
      partnerUid: `${this._odbCompanyCode}@${user.props.uid}`,
      step: ProvisioningStep.PHONE,
    });
    return user.provisionPhone({ phone, phoneProvisioning });
  }

  private async _catchUpPhoneProvisioning(user: User): Promise<User> {
    const uid = user.props.uid;
    this._logger.info(
      `[${uid}] Starting provisioning with phone because not provisioned or no phone provisionned`,
    );
    const phone = await this._getPhoneNumber(user);
    this._logger.info(`[${uid}] Retrieved phone for provisioning with phone: ${phone}`);

    const phoneProvisioning = Provisioning.from({
      partnerUid: `${this._odbCompanyCode}@${user.props.uid}`,
      step: ProvisioningStep.PHONE,
    });
    user.provisionPhone({ phone, phoneProvisioning });
    await this.registerPhone(user);
    return user;
  }

  private async _getPhoneNumber(user: User): Promise<string> {
    const uid = user.props.uid;
    const userInfos = await this._getProfileInformationGateway.getById(uid);
    const { phone } = userInfos.informations;
    return phone;
  }

  private async _processCardProvisioning(hashedPan: string, user: User): Promise<string> {
    const returnCode = await this._executeCardProvisioning(hashedPan, user);
    if (this._isProvisioningOk(returnCode))
      this._logger.info(`[${user.props.uid}] Success Card Provisioning`);
    else this._logger.info(`[${user.props.uid}] Failed Card Provisioning with error code: ${returnCode}`);
    return returnCode;
  }

  private _isProvisioningOk(code: string): boolean {
    return code === RefAuthResponseReturnTypeCodes.OK;
  }

  private async _executeCardProvisioning(hashedPan: string, user: User): Promise<string> {
    const context = { user, step: EventSteps.CARD_SENT, extraData: { hashedPan } };
    const { provisionRequest } = await this._provisioningRequestGenerator.generate(context);
    this._logger.info(`[${user.props.uid}] Card provisioning SOAP request: ${provisionRequest}`);
    const { authResponse } = await this._authRequestHandler.handleRequest({ provisionRequest });
    const authResponseStr = JSON.stringify(authResponse);
    this._logger.info(`[${user.props.uid}] Parsed card provisioning response: ${authResponseStr}`);
    const cardProvisioningResponseCode: string =
      authResponse['soap:Envelope']['soap:Body'][0]['ns2:provisionnerClientResponse'][0].RepnEnrlClnt[0]
        .BlocRetr[0].CdTypeRetr[0];
    this._logger.info(`[${user.props.uid}] Card provisioning response code: ${cardProvisioningResponseCode}`);
    return cardProvisioningResponseCode.trim();
  }
}
