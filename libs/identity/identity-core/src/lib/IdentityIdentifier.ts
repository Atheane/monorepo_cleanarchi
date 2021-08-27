export class IdentityIdentifier {
  static readonly odbIdentityMapper = Symbol.for('odbIdentityMapper');
  static readonly identityDecoder = Symbol.for('identityDecoder');
  static readonly identityService = Symbol.for('identityService');
  static readonly providerGateway = Symbol.for('providerGateway');
  static readonly identityEncoder = Symbol.for('identityEncoderGateway');
  static readonly authorizationGateway = Symbol.for('authorizationGateway');
  static readonly roleRepository = Symbol.for('roleRepository');
  static readonly verifyScaGateway = Symbol.for('verifyScaGateway');
  static readonly requestScaGateway = Symbol.for('requestScaGateway');
  static readonly consumeScaGateway = Symbol.for('consumeScaGateway');
}
