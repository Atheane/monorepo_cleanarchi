import { AuthRequestGenerator, GeneratedEchoRequest, UserUid } from '@oney/authentication-core';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'xmlbuilder';
import { DomainConfiguration } from '../../../models/DomainConfiguration';

@injectable()
export class IcgRefAuthEchoRequestGenerator implements AuthRequestGenerator<UserUid, GeneratedEchoRequest> {
  constructor(private readonly domainConfiguration: DomainConfiguration) {}

  async generate(data?: UserUid): Promise<GeneratedEchoRequest> {
    const { uid: oneyClientUid } = data;

    const companyCode = this.domainConfiguration.icgConfig.odbCompanyCode;
    const soapRequestUid = `${oneyClientUid}_${uuidv4()}`;

    const refAuthProvisionClientObj = Object.freeze({
      'soapenv:Envelope': {
        '@xmlns:peg': 'http://www.bpce.fr/xsd/peg/PEG_v0',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:exp': 'http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth',
        'soapenv:Header': {
          'peg:groupContext': {
            'peg:requestContext': {
              'peg:requestId': { '#raw': soapRequestUid },
            },
            'peg:consumerContext': {
              'peg:application': {
                'peg:name': { '#raw': 'ONEY' },
                'peg:version': { '#raw': '1.0' },
                'peg:organisation': { '#raw': 'bpce' },
              },
              'peg:run': {
                'peg:companyCode': { '#raw': companyCode },
              },
            },
          },
        },
        'soapenv:Body': {
          'exp:echo': {},
        },
      },
    });

    const requestXml = create(refAuthProvisionClientObj, {
      encoding: 'UTF-8',
      headless: true,
    }).end({ pretty: false });

    return {
      echoRequest: requestXml,
    };
  }
}
