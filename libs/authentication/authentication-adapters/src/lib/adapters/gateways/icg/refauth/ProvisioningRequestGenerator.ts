import {
  AuthRequestGenerator,
  EventSteps,
  GeneratedProvisionRequest,
  UserData,
} from '@oney/authentication-core';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'xmlbuilder';
import { DomainConfiguration } from '../../../models/DomainConfiguration';

export enum AuthenticationMethodTypes {
  SMS = '1',
  CLOUDCARD = '6',
}

export enum AuthenticationMethodStateCode {
  CREATION = 'C',
  UNLOCKING = 'D',
  LOCKING = 'B',
  DELETION = 'S',
}

export enum CivilityTypes {
  MRS = '0',
  MISS = '1',
  MISTER = '2',
  UNKNOWN = 'X',
}

export enum IcgApplications {
  BANKING_FR = 'BANKING_FR',
  ACS = 'ACS',
}

@injectable()
export class ProvisioningRequestGenerator
  implements AuthRequestGenerator<UserData, GeneratedProvisionRequest> {
  constructor(private readonly domainConfiguration: DomainConfiguration) {}

  async generate(userData: UserData): Promise<GeneratedProvisionRequest> {
    const { user, extraData, step } = userData;

    // TODO: differentiate OTP SMS / CLOUDCARD

    const companyCode = this.domainConfiguration.icgConfig.odbCompanyCode;
    const bankName = 'BD-FRA';
    const soapRequestUid = uuidv4();
    const oneyClientUid = user.props.uid;

    const oneyClientCivility = CivilityTypes.UNKNOWN;
    const oneyClientLastName = 'LASTNAMEX';
    const oneyClientFirstName = 'FIRSTNAMEX';

    // generate ListAppli array and ListMoyeAuth array based on step event type

    let ListAppli: Array<{
      CdAppliProv: { '#raw': string };
      IdClntAppli: { '#raw': string };
      ListAliasClntAppli?: Array<{
        IdAliasClntAppli: { '#raw': string };
      }>;
    }>;
    let ListMoyeAuth: Array<{
      CdTypeMoyeAuth: { '#raw': AuthenticationMethodTypes };
      MoyeAuth: { '#raw': string };
      CdEtatMoyeAuth: { '#raw': AuthenticationMethodStateCode };
      IdClntMoyeAuth: { '#raw': string };
    }>;
    let ListAliasClntAppli: Array<{
      IdAliasClntAppli: { '#raw': string };
    }>;

    // eslint-disable-next-line default-case
    switch (step) {
      case EventSteps.PHONE: {
        ListAppli = [
          {
            CdAppliProv: { '#raw': IcgApplications.BANKING_FR },
            IdClntAppli: { '#raw': `${companyCode}@${oneyClientUid}` },
          },
        ];

        ListMoyeAuth = [
          {
            CdTypeMoyeAuth: { '#raw': AuthenticationMethodTypes.SMS },
            MoyeAuth: { '#raw': user.props.phone },
            CdEtatMoyeAuth: { '#raw': AuthenticationMethodStateCode.CREATION },
            IdClntMoyeAuth: { '#raw': `${companyCode}@${oneyClientUid}` },
          },
        ];

        break;
      }

      // provision with ACS app when CARD_SENT event received (PAN must be unique)
      case EventSteps.CARD_SENT: {
        const { hashedPan } = extraData as { hashedPan: string };

        ListAliasClntAppli = [
          {
            IdAliasClntAppli: { '#raw': hashedPan },
          },
        ];

        ListAppli = [
          {
            CdAppliProv: { '#raw': IcgApplications.ACS },
            IdClntAppli: { '#raw': `${companyCode}@${oneyClientUid}` },
            ListAliasClntAppli,
          },
        ];

        break;
      }

      // TODO: provision with firstname, lastname and civility
    }

    const refAuthProvisionClientObj = Object.freeze({
      'soapenv:Envelope': {
        '@xmlns:peg': 'http://www.bpce.fr/xsd/peg/PEG_v0',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:mod': 'http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth',
        'soapenv:Header': {
          'peg:groupContext': {
            'peg:requestContext': {
              'peg:requestId': { '#raw': soapRequestUid },
            },
            'peg:consumerContext': {
              'peg:application': {
                'peg:name': { '#raw': bankName },
                'peg:version': { '#raw': '1.0' },
                'peg:organisation': { '#raw': 'ONEY' },
              },
              'peg:run': {
                'peg:companyCode': { '#raw': companyCode },
              },
            },
            'peg:goalContext': {},
          },
        },
        'soapenv:Body': {
          'mod:provisionnerClient': {
            QstnEnrlClnt: {
              BlcProvClnt: {
                IdDistr: { '#raw': 'bpce' },
                CdEtabFinn: { '#raw': companyCode },
                RefrClntProv: { '#raw': `${companyCode}@${oneyClientUid}` },
                CivlClnt: { '#raw': oneyClientCivility },
                NmPatrClnt: { '#raw': oneyClientLastName },
                PrnmClnt: { '#raw': oneyClientFirstName },
                IdGrpeClsnDacs: { '#raw': `GRP_BPCE_${companyCode}` },
                IdGrpeClsnDvs: { '#raw': `GRP_BPCE_${companyCode}` },
              },
              ListAppli,
              ListMoyeAuth,
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
      provisionRequest: requestXml,
    };
  }
}
