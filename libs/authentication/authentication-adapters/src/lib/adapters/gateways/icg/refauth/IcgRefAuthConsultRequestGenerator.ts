import { AuthRequestGenerator, GeneratedConsultRequest, UserUid } from '@oney/authentication-core';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'xmlbuilder';

@injectable()
export class IcgRefAuthConsultRequestGenerator
  implements AuthRequestGenerator<UserUid, GeneratedConsultRequest> {
  constructor(private readonly odbCompanyCode: string) {}

  async generate(data: UserUid): Promise<GeneratedConsultRequest> {
    const { uid: oneyClientUid } = data;

    const companyCode = this.odbCompanyCode;
    const soapRequestUid = uuidv4();

    const refAuthProvisionClientObj = Object.freeze({
      'soapenv:Envelope': {
        '@xmlns:peg': 'http://www.bpce.fr/xsd/peg/PEG_v0',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:mod': 'http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth',
        'soapenv:Header': {
          'peg:groupContext': {
            'peg:requestContext': {
              'peg:requestId': { '#raw': soapRequestUid },
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
        },
        'soapenv:Body': {
          'mod:consulterClient': {
            QstnCnsltClnt: {
              BlcCnsltClnt: {
                IdDistr: { '#raw': 'bpce' },
                CdEtabFinn: { '#raw': companyCode },
                RefrClntProv: { '#raw': `${companyCode}@${oneyClientUid}` },
                IdGrpeClsnDacs: { '#raw': `GRP_BPCE_${companyCode}` },
                IdGrpeClsnDvs: { '#raw': `GRP_BPCE_${companyCode}` },
              },
              BlcCritrCnslt: {
                CdIndicAppliProv: { '#raw': 'O' },
                CdIndicMoyeAuth: { '#raw': 'D' },
                CdIndicAttr: { '#raw': 'O' },
                CdIndicTrns: { '#raw': 'N' },
                NbTrns: { '#raw': 10 },
              },
            },
          },
        },
      },
    });

    const requestXml = create(refAuthProvisionClientObj, {
      encoding: 'UTF-8',
      headless: true,
    }).end({ pretty: false });

    return {
      consultRequest: requestXml,
    };
  }
}
