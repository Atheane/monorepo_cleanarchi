export class AuthIdentifier {
  static idGenerator = Symbol.for('IdGenerator');

  static otpGenerator = Symbol.for('otpGenerator');

  static channelGateway = Symbol.for('channelGateway');

  static publicKeyGateway = Symbol.for('publicKeyGateway');

  static verifierService = Symbol.for('verifierService');

  static verifierRepository = Symbol.for('verifierRepository');

  static userRepository = Symbol.for('userRepository');

  static identityEncoder = Symbol.for('identityEncoder');

  static hashGateway = Symbol.for('hashGateway');

  static authenticationGateway = Symbol.for('authenticationGateway');

  static identityEncodingService = Symbol.for('identityEncodingService');

  static invitationGateway = Symbol.for('invitationGateway');

  static invitationRepository = Symbol.for('invitationRepository');

  static userGateway = Symbol.for('userGateway');

  static busDelivery = Symbol.for('busDelivery');

  static mappers = {
    invitation: Symbol.for('invitationMapper'),
    user: Symbol.for('userMapper'),
    restrictedVerifierMapper: Symbol.for('restrictedVerifierMapper'),
  };

  static strongAuthRequestGenerator = Symbol.for('strongAuthRequestGenerator');

  static signatureGateway = Symbol.for('signatureGateway');

  static redirectHandler = Symbol.for('redirectHandler');

  static authValidationResponseHandler = Symbol.for('authValidationResponseHandler');

  static retryStrategyGenerator = Symbol.for('retryStrategyGenerator');

  static verifierGenerator = Symbol.for('verifierGenerator');

  static provisioningRequestGenerator = Symbol.for('provisioningRequestGenerator');

  static consultRequestGenerator = Symbol.for('consultRequestGenerator');

  static echoRequestGenerator = Symbol.for('echoRequestGenerator');

  static authRequestHandler = Symbol.for('authRequestHandler');

  static encryptionGateway = Symbol.for('encryptionGateway');

  static userProfileGateway = Symbol.for('userProfileGateway');

  static useIcgSmsAuthFactor = Symbol.for('useIcgSmsAuthFactor');

  static getProfileInformationGateway = Symbol.for('getProfileInformationGateway');

  static phoneProvisioningGateway = Symbol.for('phoneProvisioningGateway');

  static cardProvisioningGateway = Symbol.for('cardProvisioningGateway');

  static provisioningFunctionalErrorFactory = Symbol.for('provisioningFunctionalErrorFactory');

  static cardGateway = Symbol.for('cardGateway');

  static authVerificationGateway = Symbol.for('authVerificationGateway');
}
