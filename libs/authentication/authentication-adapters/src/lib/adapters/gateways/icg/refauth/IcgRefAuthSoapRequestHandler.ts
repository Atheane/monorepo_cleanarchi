import {
  AuthIdentifier,
  AuthRequestHandler,
  AuthResponse,
  DefaultDomainErrorMessages,
  GeneratedEchoRequest,
  GeneratedProvisionRequest,
  RefAuthError,
  RetryStrategyGenerator,
} from '@oney/authentication-core';
import axios, { AxiosInstance } from 'axios';
import { injectable, inject } from 'inversify';
import { from } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { Logger, SymLogger } from '@oney/logger-core';
import { parseStringPromise } from 'xml2js';
import * as https from 'https';
import { DomainConfiguration } from '../../../models/DomainConfiguration';
import { RetryStrategyTypes } from '../../../types/icg/RetryStrategyTypes';

@injectable()
export class IcgRefAuthSoapRequestHandler implements AuthRequestHandler {
  icgRefAuthAxiosInstance: AxiosInstance;

  icgRefAuthPath;

  constructor(
    @inject(AuthIdentifier.retryStrategyGenerator)
    private readonly retryStrategyGenerator: RetryStrategyGenerator,
    @inject(SymLogger) private readonly _logger: Logger,
    private readonly domainConfiguration: DomainConfiguration,
  ) {
    this.icgRefAuthPath = this.domainConfiguration.icgConfig.icgRefAuthPath.replace(
      '$companyCode',
      this.domainConfiguration.icgConfig.odbCompanyCode,
    );
  }

  async handleRequest<T, K>(generatedAuthRequest: T): Promise<AuthResponse<K>> {
    function isProvisionRequest(genReq): genReq is GeneratedProvisionRequest {
      return !!(genReq as GeneratedProvisionRequest).provisionRequest;
    }
    function isEchoRequest(genReq): genReq is GeneratedEchoRequest {
      return !!(genReq as GeneratedEchoRequest).echoRequest;
    }

    let requestXml: string;

    if (isProvisionRequest(generatedAuthRequest)) {
      this._logger.info(`Making a provisioning request`);

      requestXml = generatedAuthRequest.provisionRequest;
    }
    if (isEchoRequest(generatedAuthRequest)) {
      this._logger.info(`Making a echo provisioning request`);

      requestXml = generatedAuthRequest.echoRequest;
    }

    const icgRefAuthRetryStrategyOperator = this.retryStrategyGenerator.generateStrategy({
      strategyType: RetryStrategyTypes.GENERIC,
      defaultError: {
        DomainErrorConstructor: RefAuthError.ProvisionClientRequestFail,
        domainErrorText: DefaultDomainErrorMessages.REFAUTH_PROVISION_REQUEST_FAIL,
      },
    });

    const {
      caCert: caCert64,
      clientCert: clientCert64,
      clientPrivKey: clientPrivKey64,
    } = this.domainConfiguration.secretService;

    const ca = Buffer.from(caCert64, 'base64').toString('utf-8');
    const cert = Buffer.from(clientCert64, 'base64').toString('utf-8');
    const key = Buffer.from(clientPrivKey64, 'base64').toString('utf-8');

    this.icgRefAuthAxiosInstance = axios.create({
      baseURL: this.domainConfiguration.icgConfig.icgRefAuthBaseUrl,
      httpsAgent: new https.Agent({
        rejectUnauthorized: this.domainConfiguration.rejectSelfSignedCerfificateRefauthRequest, // necessary for self signed certificate in certificate chain
        ca,
        cert,
        key,
      }),
    });

    const { data: responseXml, status } = await from(
      this.icgRefAuthAxiosInstance.post<string>(this.icgRefAuthPath, requestXml),
    )
      .pipe(retryWhen(icgRefAuthRetryStrategyOperator()))
      .toPromise();

    this._logger.info(`Received raw provisioning SOAP response in body: ${responseXml}`);

    // parse xml response string to object

    const parsedData = await parseStringPromise(responseXml);
    return {
      authResponse: parsedData,
      status,
    };
  }
}
