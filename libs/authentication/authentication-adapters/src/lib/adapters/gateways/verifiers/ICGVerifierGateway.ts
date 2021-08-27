import { injectable, inject } from 'inversify';
import { MaybeType } from '@oney/common-core';
import {
  Action,
  AuthenticationError,
  AuthFactor,
  AuthIdentifier,
  AuthStatus,
  AuthValidationResonseHandler,
  RedirectHandler,
  ScaVerifierGateway,
  StrongAuthVerifier,
  UserRepository,
  VerifierGenerator,
  AuthVerifyConfig,
  AuthResponsePayload,
  AuthRequestPayload,
  User,
  AuthInitOutput,
  DefaultDomainErrorMessages,
  UserError,
} from '@oney/authentication-core';
import { URL } from 'url';
import { Verifier, VerifierServiceName } from '../../decorators/verifiers';
import { AuthInitResultMapper } from '../../mappers/icg/AuthInitResultMapper';
import { IcgAuthVerifyRequestBodyMapper } from '../../mappers/icg/IcgAuthVerifyRequestBodyMapper';
import { StrongAuthRequestGenerator } from '../../types/sca/StrongAuthRequestGenerator';
import { AuthInitSession } from '../../types/icg/AuthInitSession';
import { SamlResponse } from '../../types/icg/SamlResponse';
import { StrongAuthVerifierMetadata } from '../../types/icg/StrongAuthVerifierMetadata';

export interface ProcessConfig {
  result: AuthResponsePayload<SamlResponse>;
  action: Action;
  cookies: string[];
}

interface VerifyRequedtPayloadInput {
  credential: string;
  icgAuthInitSession: string[];
  verifier: StrongAuthVerifier;
}
interface VerifyRequestPayloadConfig {
  verifyUrl: URL;
  verifyReqbody: AuthRequestPayload;
  icgAuthInitSession: string[];
}

@Verifier(VerifierServiceName.ICG)
@injectable()
export class ICGVerifierGateway implements ScaVerifierGateway {
  private readonly _icgAuthVerifyRequestBodyMapper: IcgAuthVerifyRequestBodyMapper;

  constructor(
    @inject(AuthIdentifier.strongAuthRequestGenerator)
    private readonly _authRequestGenerator: StrongAuthRequestGenerator,
    @inject(AuthIdentifier.userRepository) private readonly _userRepository: UserRepository,
    @inject(AuthIdentifier.redirectHandler)
    private readonly _redirectHandler: RedirectHandler<SamlResponse, AuthRequestPayload, AuthInitSession>,
    @inject(AuthIdentifier.authValidationResponseHandler)
    private readonly _authValidationResonseHandler: AuthValidationResonseHandler,
    @inject(AuthIdentifier.verifierGenerator)
    private readonly _verifierGenerator: VerifierGenerator<{ cookies: string[] }>,
    @inject(AuthInitResultMapper) private readonly _authInitResultMapper: AuthInitResultMapper,
  ) {
    this._icgAuthVerifyRequestBodyMapper = new IcgAuthVerifyRequestBodyMapper();
  }

  public async generateVerifier(userId: string, action?: Action): Promise<StrongAuthVerifier> {
    const maybeUser = await this._userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing)
      return Promise.reject(new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND));
    const user = maybeUser.value;
    const url = await this._forgeSecurityAssertionRequest(user);
    const { result, cookies } = await this._executeSecurityAssertionRequest(url, user);
    const strongAuthVerifier = await this._processAuthInitResponse({ result, action, cookies }, user);
    return strongAuthVerifier;
  }

  public async verify(verifier: StrongAuthVerifier, credential?: string): Promise<StrongAuthVerifier> {
    if (verifier.isVerifierExpired()) return this._setToExpired(verifier);
    if (this._isSmsVerifierAndNoCredentialProvided(credential, verifier))
      return this._rejectBadCredentialError(verifier);
    const verifyResponsePayload = await this._processVerification(credential, verifier);
    const updatedVerifier = await this._updateVerifier(verifyResponsePayload, verifier);
    return updatedVerifier;
  }

  private _setToExpired(verifier: StrongAuthVerifier): StrongAuthVerifier {
    return new StrongAuthVerifier({ ...verifier, status: AuthStatus.EXPIRED, valid: false });
  }

  private _isSmsVerifierAndNoCredentialProvided(credential: string, verifier: StrongAuthVerifier): boolean {
    return verifier.factor === AuthFactor.OTP && !credential;
  }

  private async _processAuthInitResponse({ result, action, cookies }: ProcessConfig, user: User) {
    const icgAuthInitResult = this._authInitResultMapper.toDomain({ result, uid: user.props.uid });
    const verifierContext = { user, action, result: icgAuthInitResult, cookies };
    const strongAuthVerifier = await this._verifierGenerator.generateVerifier(verifierContext);
    return strongAuthVerifier;
  }

  private async _forgeSecurityAssertionRequest(user: User): Promise<URL> {
    const { url } = await this._authRequestGenerator.generateRequest(user.props.uid);
    return url;
  }

  private async _executeSecurityAssertionRequest(
    url: URL,
    user: User,
  ): Promise<AuthInitOutput<SamlResponse>> {
    const authInitOutput = await this._redirectHandler.handleRedirect(url, user.props.uid);
    return authInitOutput;
  }

  private async _processVerification(
    credential: string,
    verifier: StrongAuthVerifier,
  ): Promise<AuthResponsePayload<SamlResponse>> {
    const { icgAuthInitSession } = this._extractAuthInitResultFromMetadata(verifier);
    const config = this._configureVerifyRequest({ credential, icgAuthInitSession, verifier });
    const verifyResponsePayload = await this._executeVerifyRequest(config);
    return verifyResponsePayload;
  }

  private _configureVerifyRequest({
    credential,
    icgAuthInitSession,
    verifier,
  }: VerifyRequedtPayloadInput): VerifyRequestPayloadConfig {
    const verifyUrl = this._generateVerifyUrl(verifier);
    const verifyReqbody = this._generateVerifyRequestPayload(credential, verifier);
    const config = { verifyUrl, verifyReqbody, icgAuthInitSession };
    return config;
  }

  private _rejectBadCredentialError(verifier: StrongAuthVerifier): Promise<never> {
    const e = new AuthenticationError.BadCredentials();
    e.cause = verifier;
    return Promise.reject(e);
  }

  private _extractAuthInitResultFromMetadata(verifier: StrongAuthVerifier): StrongAuthVerifierMetadata {
    return verifier.metadatas as StrongAuthVerifierMetadata;
  }

  private _generateVerifyUrl(verifier: StrongAuthVerifier): URL {
    const { baseUrl, verifyPath } = this._authRequestGenerator.getRequestConfig();
    const path = verifyPath.replace('$verifierId', verifier.verifierId);
    return new URL(path, baseUrl);
  }

  private _generateVerifyRequestPayload(
    credential: string,
    verifier: StrongAuthVerifier,
  ): AuthRequestPayload {
    const { icgAuthInitResult } = this._extractAuthInitResultFromMetadata(verifier);
    return this._icgAuthVerifyRequestBodyMapper.toDomain({
      data: icgAuthInitResult,
      credential,
    });
  }

  private _executeVerifyRequest(
    config: AuthVerifyConfig<AuthRequestPayload, AuthInitSession>,
  ): Promise<AuthResponsePayload<SamlResponse>> {
    return this._redirectHandler.handleVerifyRequest(config);
  }

  private _updateVerifier(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier,
  ): Promise<StrongAuthVerifier> {
    return this._authValidationResonseHandler.handleResponsePayload(payload, verifier);
  }
}
