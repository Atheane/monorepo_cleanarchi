import {
  AuthenticationError,
  AuthIdentifier,
  DefaultDomainErrorMessages,
  RedirectHandler,
  RetryStrategyGenerator,
  RetryStrategyOperatorFactory,
  AuthVerifyConfig,
  AuthResponsePayload,
  AuthRequestPayload,
  OtpSmsAuthMethod,
  PinAuthMethod,
  InnerResponseStatus,
} from '@oney/authentication-core';
import { AxiosHttpMethod, httpBuilder, AxiosConfiguration } from '@oney/http';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { injectable, inject, unmanaged } from 'inversify';
import { from } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { parseStringPromise } from 'xml2js';
import { Logger } from '@oney/logger-core';
import { URL } from 'url';
import { Agent } from 'https';
import {
  DacsErrorValues,
  ExceedSamlResponseStatus,
  IcgAuthInitMappedErrorSamlResponse,
  UnknownUserSamlResponseStatus,
} from '../mappers/icg/IcgAuthInitResponseXmlMapper';
import { StrongAuthRequestGenerator } from '../types/sca/StrongAuthRequestGenerator';
import { SamlResponse } from '../types/icg/SamlResponse';
import { AuthInitSession } from '../types/icg/AuthInitSession';
import { RetryStrategyTypes } from '../types/icg/RetryStrategyTypes';

export type AuthInitMethod = OtpSmsAuthMethod | PinAuthMethod;

export type ValidationUnit<T = AuthInitMethod> = {
  [id: string]: T[];
};

export interface IcgRedirectHandlerReturn {
  result: AuthResponsePayload<SamlResponse>;
  cookies: string[];
}

const httpService = new AxiosHttpMethod();
const oneyHttpClient = httpBuilder(httpService);

@injectable()
export class IcgRedirectHandler
  implements RedirectHandler<SamlResponse, AuthRequestPayload, AuthInitSession> {
  constructor(
    @inject(AuthIdentifier.strongAuthRequestGenerator)
    private readonly strongAuthRequestGenerator: StrongAuthRequestGenerator,
    @inject(AuthIdentifier.retryStrategyGenerator)
    private readonly retryStrategyGenerator: RetryStrategyGenerator,
    @unmanaged() private readonly rejectSelfSignedCerfificateSamlRequest: boolean,
    @unmanaged() private readonly _logger: Logger,
  ) {}

  async handleRedirect(url: URL, userId: string): Promise<IcgRedirectHandlerReturn> {
    const {
      icgAuthInitFollowRedirectRetryStrategyOperator,
      icgAuthInitSamlRetryStrategyOperator,
    } = this._generateAuthInitRetryStrategyOperators(userId);

    const authInitHttpsAgent = this._createHttpsAgent();

    const samlRequestAxiosInstance = this._createAxiosInstance({
      httpsAgent: authInitHttpsAgent,
      samlRedirect: true,
    });

    const { headers } = await this._processRequestWithRetryStrategy(
      samlRequestAxiosInstance.get(url.href),
      icgAuthInitSamlRetryStrategyOperator,
      {
        strongAuthRequestGenerator: this.strongAuthRequestGenerator,
      },
    );

    const redirectHeaders = { ...headers };
    const { redirectCookies, redirectLocation } = this._extractCookiesAndRedirectLocation(redirectHeaders);

    this._logger.info(`Cookies from response to saml request: ${redirectHeaders['set-cookie']}`);

    const extractedCookiesSaml = this._extractStickySeesionCookies(redirectCookies);
    this._logger.info(`Extracted cookies from redirect response: ${JSON.stringify(extractedCookiesSaml)}`);

    delete redirectHeaders['set-cookie'];
    delete redirectHeaders.location;

    const redirectionUrl = new URL(redirectLocation, url.origin);

    const followRedirectAxiosInstance = this._createAxiosInstance({
      httpsAgent: authInitHttpsAgent,
      headers: {
        ...redirectHeaders,
        cookie: redirectCookies.join(';'),
      },
    });

    const {
      data: icgAuthInitData,
      headers: icgAuthInitHeaders,
    } = await this._processRequestWithRetryStrategy<AuthResponsePayload<SamlResponse>>(
      followRedirectAxiosInstance.get<AuthResponsePayload<SamlResponse>>(redirectionUrl.href),
      icgAuthInitFollowRedirectRetryStrategyOperator,
    );

    this._logger.info(
      `Cookies from response to authentication redirect request: ${icgAuthInitHeaders['set-cookie']}`,
    );

    await this._handleFailedAuthInit(icgAuthInitData, userId);

    const followRedirectCookies: string[] = icgAuthInitHeaders['set-cookie'];

    const extractedCookiesRedirect = this._extractStickySeesionCookies(followRedirectCookies);
    this._logger.info(
      `Extracted cookies from redirect response: ${JSON.stringify(extractedCookiesRedirect)}`,
    );

    const extractedCookiesAuthInit = { ...extractedCookiesSaml, ...extractedCookiesRedirect };

    this._logger.info(
      `Merged extracted cookies from saml and redirect response: ${JSON.stringify(extractedCookiesAuthInit)}`,
    );

    const savedCookies = Object.values(extractedCookiesAuthInit);

    return Promise.resolve({ result: icgAuthInitData, cookies: savedCookies });
  }

  async handleVerifyRequest({
    verifyUrl,
    icgAuthInitSession,
    verifyReqbody,
  }: AuthVerifyConfig<AuthRequestPayload, AuthInitSession>): Promise<AuthResponsePayload<SamlResponse>> {
    const nodeHttpsAgent = this._createHttpsAgent();
    this._logger.info(`HTTPS AGENT FOR VERIFY - ${JSON.stringify(nodeHttpsAgent)}`);

    const clientConfig: AxiosConfiguration = {
      httpsAgent: nodeHttpsAgent,
    };
    this._logger.info(`ONEY/HTTP CLIENT CONFIG - ${JSON.stringify(clientConfig)}`);

    // allow or not self-signed certificates
    oneyHttpClient.setRequestsConfiguration<AxiosConfiguration>(clientConfig);

    // set cookies from ICG auth init response
    oneyHttpClient.setAdditionnalHeaders({
      Cookie: icgAuthInitSession.join(';'),
    });

    const icgAuthVerifyRetryOperator = this.retryStrategyGenerator.generateStrategy({
      defaultError: {
        DomainErrorConstructor: AuthenticationError.AuthVerifyFail,
        domainErrorText: DefaultDomainErrorMessages.AUTH_VERIFY_FAIL,
      },
    });

    const { data: icgAuthValidationResponseData } = await from(
      oneyHttpClient.post<AuthResponsePayload<SamlResponse>>(verifyUrl.href, verifyReqbody).execute(),
    )
      .pipe(retryWhen(icgAuthVerifyRetryOperator()))
      .toPromise();
    return icgAuthValidationResponseData;
  }

  private _generateAuthInitRetryStrategyOperators(userId: string) {
    const icgAuthInitSamlRetryStrategyOperator = this.retryStrategyGenerator.generateStrategy({
      strategyType: RetryStrategyTypes.AUTH_INIT_SAML,
      userId,
    });
    const icgAuthInitFollowRedirectRetryStrategyOperator = this.retryStrategyGenerator.generateStrategy({
      strategyType: RetryStrategyTypes.AUTH_INIT_FOLLOW_REDIRECT,
    });

    return {
      icgAuthInitSamlRetryStrategyOperator,
      icgAuthInitFollowRedirectRetryStrategyOperator,
    };
  }

  private _createHttpsAgent(): Agent {
    this._logger.info(
      `rejectSelfSignedCerfificateSamlRequest: ${this.rejectSelfSignedCerfificateSamlRequest}`,
    );
    return new Agent({
      // accept self-signed certificates
      rejectUnauthorized: this.rejectSelfSignedCerfificateSamlRequest,
    });
  }

  private _createAxiosInstance(options: {
    httpsAgent: Agent;
    headers?;
    samlRedirect?: boolean;
  }): AxiosInstance {
    return axios.create({
      ...(options.samlRedirect && {
        // intercept redirect
        maxRedirects: 0,
        // Resolve only if the status code is 303 (other status considered error)
        validateStatus: status => status === 303,
      }),
      httpsAgent: options.httpsAgent,
      headers: options.headers,
    });
  }

  private async _processRequestWithRetryStrategy<T>(
    responsePromise: Promise<AxiosResponse<T>>,
    retryStrategyOperator: RetryStrategyOperatorFactory,
    options?: {},
  ): Promise<AxiosResponse<T>> {
    return await from(responsePromise)
      .pipe(retryWhen(retryStrategyOperator(options)))
      .toPromise();
  }

  private _extractCookiesAndRedirectLocation(headers) {
    const redirectCookies: string[] = headers['set-cookie'];
    const redirectLocation: string = headers.location;

    return {
      redirectCookies,
      redirectLocation,
    };
  }

  private _extractStickySeesionCookies(cookies: string[]): { [x: string]: string } {
    const cookiesObject = cookies.reduce((acc, cookie) => {
      const cookieKey = cookie.split('=')[0];
      acc[cookieKey] = cookie;
      return acc;
    }, {});
    this._logger.info(`Extracted cookies: ${JSON.stringify(cookiesObject)}`);

    return cookiesObject;
  }

  private async _handleFailedAuthInit(payload: AuthResponsePayload<SamlResponse>, userId: string) {
    if (payload.response?.status === InnerResponseStatus.INIT_FAILED) {
      const { saml2_post } = payload.response;
      const { samlResponse: samlResponse64 } = saml2_post;
      // find the cause of failed auth init
      const decodedSamlResponse = Buffer.from(samlResponse64, 'base64').toString('utf-8');
      const mappedErrorResponseBody = await parseStringPromise(decodedSamlResponse);
      const {
        'saml2p:Response': {
          'saml2p:Status': { 0: samlStatus },
        },
      } = mappedErrorResponseBody as IcgAuthInitMappedErrorSamlResponse;

      const samlResponseStatusCodeA = (samlStatus as unknown) as ExceedSamlResponseStatus;
      const samlResponseStatusCodeB = (samlStatus as unknown) as UnknownUserSamlResponseStatus;

      // eslint-disable-next-line default-case
      switch (true) {
        case samlResponseStatusCodeA['saml2p:StatusCode'][0].$.Value === DacsErrorValues.AUTH_FAILED &&
          samlResponseStatusCodeA['saml2p:StatusMessage'][0] === DacsErrorValues.EXCEED_ACTIVE_SMS: {
          return Promise.reject(new AuthenticationError.AuthInitTooManyAuthSessionsForUser(userId));
        }

        case samlResponseStatusCodeB['saml2p:StatusCode'][0].$.Value === DacsErrorValues.UNKNOWN_USER: {
          return Promise.reject(new AuthenticationError.AuthInitUnknownUser(userId));
        }
      }
    }
  }
}
