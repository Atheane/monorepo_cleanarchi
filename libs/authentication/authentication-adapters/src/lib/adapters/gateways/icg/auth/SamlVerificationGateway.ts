import {
  AuthenticationError,
  AuthVerificationGateway,
  DefaultDomainErrorMessages,
  DefaultUiErrorMessages,
} from '@oney/authentication-core';
import { injectable } from 'inversify';
import { DOMParser } from 'xmldom';
import { SignedXml, FileKeyInfo } from 'xml-crypto';
import { DomainError } from '@oney/common-core';
import { AuthSignatureVerificationFailed } from '@oney/authentication-messages';
import { EventDispatcher } from '@oney/messages-core';

@injectable()
export class SamlVerificationGateway implements AuthVerificationGateway {
  constructor(
    private readonly _domParser: DOMParser,
    private readonly _samlResponseSignCert: string,
    private readonly _eventDispatcher: EventDispatcher,
    private readonly _errorNotificationRecipient: string,
  ) {}

  public async checkSignature(document: string, uid: string): Promise<void> {
    try {
      const decodedSaml = Buffer.from(document, 'base64').toString('utf-8');
      const samlDoc = this._domParser.parseFromString(decodedSaml);
      const { AuthnFailedStatusMsg, signature } = this._getNodes(samlDoc);
      if (AuthnFailedStatusMsg?.textContent === 'Locked' && !signature) return;
      const sig = this._buildSignedXml(signature);
      if (!sig.checkSignature(decodedSaml)) {
        throw new AuthenticationError.SecurityAssertionInvalidSignature(
          DefaultDomainErrorMessages.SECURITY_ASSERTION_INVALID_SIGNATURE,
          { code: '401', msg: DefaultUiErrorMessages.SECURITY_ASSERTION_INVALID_SIGNATURE },
        );
      }
    } catch (error) {
      const domainError = await this._dispatchNotification(error, uid);
      throw domainError;
    }
  }

  private _getNodes(samlDoc: Document): { AuthnFailedStatusMsg: Element; signature: Element } {
    const signature = samlDoc.getElementsByTagName('ds:Signature').item(0);
    const AuthnFailedStatusMsg = samlDoc.getElementsByTagName('saml2p:StatusMessage').item(0);
    return { AuthnFailedStatusMsg, signature };
  }

  private _buildSignedXml(signature: Element): SignedXml {
    const sig = new SignedXml();
    sig.keyInfoProvider = new FileKeyInfo();
    // this is a hack: xml-crypto can only load key from local filepath as of v2.1.1
    const getKeyFromSecrets = () => Buffer.from(this._samlResponseSignCert, 'base64');
    sig.keyInfoProvider.getKey = getKeyFromSecrets;
    sig.loadSignature(signature);
    return sig;
  }

  private async _dispatchNotification(error: DomainError, uid: string): Promise<DomainError> {
    let domainError = error;
    if (domainError.constructor.name !== AuthenticationError.SecurityAssertionInvalidSignature.name) {
      const msg = `${DefaultDomainErrorMessages.SECURITY_ASSERTION_SIGNATURE_VERIFICATION_FAILED}: ${error.message}`;
      const cause = {
        code: '401',
        msg: DefaultUiErrorMessages.SECURITY_ASSERTION_SIGNATURE_VERIFICATION_FAILED,
      };
      domainError = new AuthenticationError.SecurityAssertionSignatureVerificationFailed(msg, cause);
    }
    const props = {
      uid,
      reason: domainError.message,
      name: domainError.name,
      recipient: this._errorNotificationRecipient,
    };
    const authSignatureVerificationFailed = new AuthSignatureVerificationFailed(props);
    await this._eventDispatcher.dispatch(authSignatureVerificationFailed);
    return domainError;
  }
}
