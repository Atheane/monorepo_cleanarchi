import { AuthIdentifier, SignatureGateway } from '@oney/authentication-core';
import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'xmlbuilder';
import { deflateSync } from 'zlib';
import { URL } from 'url';
import { DomainConfiguration } from '../../models/DomainConfiguration';
import { StrongAuthRequestGenerator } from '../../types/sca/StrongAuthRequestGenerator';

enum DescKeyType {
  ADD_BENEFICIARY = "Demande d'ajout de bénéficiaire externe : Mr X",
}

export interface AuthUrlConfig {
  baseUrl: string;
  samlRequest64: string;
  sigAlg: string;
  signature: string;
}

@injectable()
export class IcgStrongAuthRequestGenerator implements StrongAuthRequestGenerator {
  private _icgAuthBaseUrl: string;
  private _icgAuthSamlPath: string;
  private _icgAuthVerifyPath: string;
  private _icgApplication: string;
  private _icgContextId: string;

  constructor(
    @inject(AuthIdentifier.signatureGateway) private readonly _odbSignatureGateway: SignatureGateway,
    private readonly _domainConfiguration: DomainConfiguration,
  ) {
    this._setRequestProps();
  }

  private _setRequestProps() {
    const icgConfig = this._domainConfiguration.icgConfig;
    this._icgAuthBaseUrl = icgConfig.icgBaseUrl;
    this._icgAuthSamlPath = icgConfig.icgSamlPath;
    this._icgAuthVerifyPath = icgConfig.icgVerifyPath;
    this._icgApplication = icgConfig.icgApplication;
    this._icgContextId = icgConfig.icgContextId;
  }

  async generateRequest(uid: string): Promise<{ url: URL }> {
    const { icgAuthSamlPartialUrl, samlReq64, sigAlg, signature64 } = await this._processSamlGeneration(uid);
    const conf = { baseUrl: icgAuthSamlPartialUrl, samlRequest64: samlReq64, signature: signature64, sigAlg };
    const icgAuthSamlFullUrl = this._generateFullAuthUrl(conf);
    return { url: icgAuthSamlFullUrl };
  }

  getRequestConfig() {
    return {
      baseUrl: this._icgAuthBaseUrl,
      securityAssertionPath: this._icgAuthSamlPath,
      verifyPath: this._icgAuthVerifyPath,
    };
  }

  private async _processSamlGeneration(uid: string) {
    const icgAuthSamlPartialUrl = new URL(this._icgAuthSamlPath, this._icgAuthBaseUrl).href;
    const sigAlg = this._domainConfiguration.icgConfig.odbSigAlgUrl;
    const samlReqXml = this._generateSamlRequest(uid);
    const deflatedSamlReq = this._deflate(samlReqXml);
    const samlReq64 = this._toBase64(deflatedSamlReq);
    const queryString = this._generateQueryString(samlReq64, sigAlg);
    const signature64 = await this._odbSignatureGateway.sign(queryString);
    return { icgAuthSamlPartialUrl, samlReq64, sigAlg, signature64 };
  }

  private _generateSamlRequest(uid: string): string {
    // SAML request id cannot start with number
    const samlRequestId = `_${uuidv4()}`;
    const assertionConsumerServiceURL = 'url_appelant';
    const samlIssuer = this._icgApplication;
    const dacsSecurityLevel = '202';
    const dacsContextId = this._icgContextId;
    const NOTIF_TITLE_KEY = 'Opération sensible';
    const NOTIF_DESC_KEY = 'Demande authentification';
    const DESC_KEY = DescKeyType.ADD_BENEFICIARY;
    const SENDER_NAME_KEY = '12869';
    const SEND_NOTIF_KEY = 'true';
    const smsText =
      'Oney Banque Digitale&#58;&#xd;Pour valider la connexion sur votre application mobile&#46;&#xd;Code:';
    const provisionedClientId = `${this._domainConfiguration.icgConfig.odbCompanyCode}@${uid}`;

    const namespaces = Object.freeze({
      'xmlns:saml': 'urn:oasis:names:tc:SAML:2.0:assertion',
      'xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
      'xmlns:dacs': 'http://www.dictao.com/dacs/1.0',
    });

    const SAMLRequestObj = Object.freeze({
      'samlp:AuthnRequest': {
        '@xmlns:saml': namespaces['xmlns:saml'],
        '@xmlns:samlp': namespaces['xmlns:samlp'],
        '@ID': samlRequestId,
        '@AssertionConsumerServiceURL': assertionConsumerServiceURL,
        '@Version': '2.0',
        '@ForceAuthn': 'false',
        '@IssueInstant': new Date().toISOString(),
        '@ProtocolBinding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        'saml:Issuer': {
          '@xmlns:saml': namespaces['xmlns:saml'],
          '#raw': samlIssuer,
        },
        'samlp:Extensions': {
          'dacs:SecurityLevel': {
            '@xmlns:dacs': namespaces['xmlns:dacs'],
            '#raw': dacsSecurityLevel,
          },
          'dacs:Context': {
            '@id': dacsContextId,
            '@xmlns:dacs': namespaces['xmlns:dacs'],
            'dacs:ContextMetadata': [
              {
                '@name': 'NOTIF_TITLE_KEY',
                '#raw': NOTIF_TITLE_KEY,
              },
              {
                '@name': 'NOTIF_DESC_KEY',
                '#raw': NOTIF_DESC_KEY,
              },
              {
                '@name': 'DESC_KEY',
                '#raw': DESC_KEY,
              },
              {
                '@name': 'SENDER_NAME_KEY',
                '#raw': SENDER_NAME_KEY,
              },
              {
                '@name': 'SEND_NOTIF_KEY',
                '#raw': SEND_NOTIF_KEY,
              },
              {
                '@name': 'texte_sms',
                '#raw': smsText,
              },
            ],
          },
        },
        'saml:Subject': {
          '@xmlns:saml': namespaces['xmlns:saml'],
          'saml:NameID': provisionedClientId,
        },
      },
    });

    const samlXml = create(SAMLRequestObj, {
      encoding: 'UTF-8',
      headless: true,
    }).end({ pretty: false });

    return samlXml;
  }

  private _generateQueryString(samlRequest64: string, sigAlg: string): string {
    const params = new URLSearchParams({
      SAMLRequest: samlRequest64,
      SigAlg: sigAlg,
    });
    // values are automatically URL encoded
    const qs = params.toString();

    return qs;
  }

  private _deflate(samlReq: string) {
    const buf = Buffer.from(samlReq);
    return deflateSync(buf);
  }

  private _toBase64(buf: Buffer): string {
    return buf.toString('base64');
  }

  private _generateFullAuthUrl(conf: AuthUrlConfig): URL {
    const url = new URL(conf.baseUrl);
    const params = { SAMLRequest: conf.samlRequest64, SigAlg: conf.sigAlg, Signature: conf.signature };
    const searchParams = new URLSearchParams(params);
    url.search = searchParams.toString();
    return url;
  }
}
