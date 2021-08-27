export enum RefAuthResponseReturnTypeCodes {
  OK = '0',
  ALERT = '1',
  TECHNICAL_ERROR = '2',
  REQUEST_ERROR = '3',
  CONTRACT_EXECUTION_ERROR = '4',
}

type SoapHeaderParsed = [
  {
    'peg:groupContext': [
      {
        $: {
          'xmlns:peg': 'http://www.bpce.fr/xsd/peg/PEG_v0';
        };
        'peg:requestContext': [
          {
            'peg:requestId': [string];
          },
        ];
        'peg:consumerContext': [
          {
            'peg:application': [
              {
                'peg:name': [string];
                'peg:version': [string];
                'peg:organisation': [string];
              },
            ];
            'peg:run': [
              {
                'peg:companyCode': string[];
              },
            ];
          },
        ];
        'peg:goalContext': [string];
      },
    ];
  },
];

export interface ProvisionClientParsedResponseData {
  'soap:Envelope': {
    $: {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/';
    };
    'soap:Header': SoapHeaderParsed;
    'soap:Body': [
      {
        'ns2:provisionnerClientResponse': [
          {
            $: {
              'xmlns:ns2': 'http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth';
              'xmlns:ns3': 'http://www.bpce.fr/xsd/peg/PEG_v0';
            };
            RepnEnrlClnt: [
              {
                BlocRetr: [
                  {
                    CdTypeRetr: [RefAuthResponseReturnTypeCodes];
                  },
                ];
                BlcActvtnCc: [
                  {
                    ActivationCd: [string];
                    CcServerUrl: [string];
                  },
                ];
              },
            ];
          },
        ];
      },
    ];
  };
}

/**
 * Errors:
 * - existing PAN
 * - empty value
 */
export interface ProvisionClientErrorParsedResponseData {
  'soap:Envelope': {
    $: {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/';
    };
    'soap:Header': SoapHeaderParsed;
    'soap:Body': [
      {
        'ns2:provisionnerClientResponse': [
          {
            $: {
              'xmlns:ns2': 'http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth';
              'xmlns:ns3': 'http://www.bpce.fr/xsd/peg/PEG_v0';
            };
            RepnEnrlClnt: [
              {
                BlocRetr: [
                  {
                    CdTypeRetr: [RefAuthResponseReturnTypeCodes];
                    BlocMess: [
                      {
                        IdMess: [string];
                        ListMess: Array<{ LbMess: [string] }>;
                      },
                    ];
                  },
                ];
              },
            ];
          },
        ];
      },
    ];
  };
}
