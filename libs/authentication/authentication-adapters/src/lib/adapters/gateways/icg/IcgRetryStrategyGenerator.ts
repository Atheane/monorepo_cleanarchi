import {
  AuthenticationError,
  DefaultDomainErrorMessages,
  RetryConfig,
  RetryStrategyFactoryOptions,
  RetryStrategyGenerator,
} from '@oney/authentication-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RetryStrategyTypes } from '../../types/icg/RetryStrategyTypes';
import { StrongAuthRequestGenerator } from '../../types/sca/StrongAuthRequestGenerator';

export interface RetryOperatorGenerator {
  (retryUtils: object, { retryLimit, scalingDuration, excludedStatusCodes }?: RetryConfig): (
    attempts: Observable<AxiosError<any>>,
  ) => Observable<number>;
}

export interface RetryUtils {
  strongAuthRequestGenerator: StrongAuthRequestGenerator;
}

@injectable()
export class IcgRetryStrategyGenerator implements RetryStrategyGenerator {
  constructor(@inject(SymLogger) private readonly _logger: Logger) {}

  generateStrategy(options?: RetryStrategyFactoryOptions): RetryOperatorGenerator {
    switch (options.strategyType) {
      case RetryStrategyTypes.AUTH_INIT_SAML: {
        return this._createSamlAuthRetryOperator(options.userId);
      }

      case RetryStrategyTypes.AUTH_INIT_FOLLOW_REDIRECT: {
        return this._createFollowAuthRedirectRetryOperator();
      }

      default: {
        return this._createDefaultRetryOperator(options);
      }
    }
  }

  private _createSamlAuthRetryOperator(userId: string) {
    return (retryUtils: RetryUtils, { retryLimit = 5, scalingDuration = 1000 }: RetryConfig = {}) => (
      attempts: Observable<AxiosError>,
    ) =>
      attempts.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          /* istanbul ignore if */
          if (!error.response) {
            console.log(`SAML retry strategy - Attempt ${i} - ${error}`);
            return throwError(error);
          }

          if (retryAttempt > retryLimit) {
            return throwError(
              new AuthenticationError.AuthInitRedirectToErrorPage(
                DefaultDomainErrorMessages.AUTH_INIT_REDIRECT_TO_ERROR_PAGE,
              ),
            );
          }

          const errorStatus = error.response.status;
          if (this._isNotErrorPageStatus(errorStatus)) return this._handleErrorStatus(errorStatus);

          this._createRetrySamlRequest(retryUtils, userId, error);
          return this._handleExponentialBackoff(retryAttempt, scalingDuration);
        }),
      );
  }

  private _handleErrorStatus(status: number): Promise<never> {
    switch (status) {
      // error according to specifications because the API must redirect
      case 200: {
        return Promise.reject(
          new AuthenticationError.AuthInitNoRedirect(DefaultDomainErrorMessages.AUTH_INIT_NO_REDIRECT),
        );
      }

      default: {
        return Promise.reject(
          new AuthenticationError.AuthInitSamlRequestFail(
            DefaultDomainErrorMessages.AUTH_INIT_SAML_REQUEST_FAIL,
          ),
        );
      }
    }
  }

  private _isNotErrorPageStatus(status: number): boolean {
    // 302 = ICG redirect to nondescript error page
    const errorPageRedirectStatusCode = 302;
    return status !== errorPageRedirectStatusCode;
  }

  private _createRetrySamlRequest(retryUtils: RetryUtils, userId: string, error: AxiosError): void {
    retryUtils.strongAuthRequestGenerator.generateRequest(userId).then(({ url: newSamlRequestUrl }) => {
      const newSearchParams = newSamlRequestUrl.searchParams;

      // update url and params of original request with new SAML request

      // eslint-disable-next-line no-param-reassign
      error.config.url = newSamlRequestUrl.href;
      // eslint-disable-next-line no-param-reassign
      error.config.params = newSearchParams;
    });
  }

  private _createFollowAuthRedirectRetryOperator() {
    return ({ retryLimit = 5, scalingDuration = 1000 }: RetryConfig = {}) => (
      attempts: Observable<AxiosError>,
    ) =>
      attempts.pipe(
        mergeMap((error, i) => {
          const attempt = i + 1;
          if (attempt > retryLimit) {
            return throwError(
              new AuthenticationError.AuthInitFollowRedirectFail(
                DefaultDomainErrorMessages.AUTH_INIT_FOLLOW_REDIRECT_FAIL,
              ),
            );
          }
          return this._handleExponentialBackoff(attempt, scalingDuration);
        }),
      );
  }

  private _createDefaultRetryOperator(options) {
    return ({ retryLimit = 5, scalingDuration = 1000 }: RetryConfig = {}) => (
      attempts: Observable<AxiosError>,
    ) =>
      attempts.pipe(
        mergeMap((error, i) => {
          const attempt = i + 1;
          if (attempt > retryLimit) {
            const { domainErrorText, DomainErrorConstructor } = options.defaultError;

            const defaultInternalErrorMsg =
              'Something unexpected happenned when contacting our partners, please contact the support team';
            const defaultErrorCode = 500;
            const message: string =
              error?.response?.data.error.message ??
              domainErrorText ??
              error?.message ??
              defaultInternalErrorMsg;
            const code: number = error?.response?.data.error.code ?? defaultErrorCode;

            this._logger.info(
              `Error occured in default retry strategy with message: ${message}, (code: ${code})`,
            );

            return throwError(
              new DomainErrorConstructor(error.message, {
                msg: message,
                code: code,
              }),
            );
          }

          return this._handleExponentialBackoff(attempt, scalingDuration);
        }),
      );
  }

  private _handleExponentialBackoff(retryAttempt: number, scalingDuration: number): Observable<number> {
    return timer(retryAttempt * scalingDuration);
  }
}
