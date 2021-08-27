export enum DacsErrorValues {
  UNKNOWN_USER = 'urn:oasis:names:tc:SAML:2.0:status:UnknownPrincipal',
  AUTH_FAILED = 'urn:oasis:names:tc:SAML:2.0:status:AuthnFailed',
  EXCEED_ACTIVE_SMS = 'Exceeded',
}

export interface UnknownUserSamlResponseStatus {
  'saml2p:StatusCode': [
    {
      $: {
        Value: DacsErrorValues;
      };
    },
  ];
}
export interface IcgAuthInitUnknownUserErrorMappedSamlResponse {
  'saml2p:Response': {
    $: {
      'xmlns:saml2p': 'urn:oasis:names:tc:SAML:2.0:protocol';
      Destination: string;
      ID: string;
      InResponseTo: string;
      IssueInstant: string;
      Version: string;
    };
    'saml2:Issuer': [
      {
        _: 'urn:dictao:dacs';
        $: {
          'xmlns:saml2': 'urn:oasis:names:tc:SAML:2.0:assertion';
        };
      },
    ];
    'saml2p:Status': [UnknownUserSamlResponseStatus];
  };
}

export interface ExceedSamlResponseStatus {
  'saml2p:StatusCode': [
    {
      $: {
        Value: DacsErrorValues.AUTH_FAILED;
      };
    },
  ];
  'saml2p:StatusMessage': [DacsErrorValues.EXCEED_ACTIVE_SMS];
}

export interface IcgAuthInitExceedNbActiveSmsErrorMappedSamlResponse {
  'saml2p:Response': {
    $: {
      'xmlns:saml2p': 'urn:oasis:names:tc:SAML:2.0:protocol';
      Destination: string;
      ID: string;
      InResponseTo: string;
      IssueInstant: string;
      Version: string;
    };
    'saml2:Issuer': [
      {
        _: 'urn:dictao:dacs';
        $: {
          'xmlns:saml2': 'urn:oasis:names:tc:SAML:2.0:assertion';
        };
      },
    ];
    'saml2p:Status': [ExceedSamlResponseStatus];
  };
}

export type IcgAuthInitMappedErrorSamlResponse =
  | IcgAuthInitUnknownUserErrorMappedSamlResponse
  | IcgAuthInitExceedNbActiveSmsErrorMappedSamlResponse;
