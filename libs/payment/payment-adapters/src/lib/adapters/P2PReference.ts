import { BankAccountType } from '@oney/payment-core';

export interface TagMapProperties {
  outstandingCode: string;
  operationCodeType: string;
  productCode: string;
  subscriptionMontlyNumber: string;
  countryCode: string;
  senderType: BankAccountType;
  beneficiaryType: BankAccountType;
  ref: number;
  checkLimits: boolean;
  processUnPaid: boolean;
}

export const P2PReferences: TagMapProperties[] = [
  {
    ref: 1,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 61,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '002',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 62,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '003',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 2,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 63,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '002',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 64,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '003',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 65,
    outstandingCode: '',
    operationCodeType: 'ECHEANCE4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '004',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 3,
    outstandingCode: '',
    operationCodeType: 'REMBOURSEMENT3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.BANK_CREDIT_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 4,
    outstandingCode: '',
    operationCodeType: 'REMBOURSEMENT4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.BANK_CREDIT_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 5,
    outstandingCode: '',
    operationCodeType: 'REMBT ANTICIPE3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 6,
    outstandingCode: '',
    operationCodeType: 'REMBT ANTICIPE4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 7,
    outstandingCode: '',
    operationCodeType: 'FINANCEMENT3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.BANK_CREDIT_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 8,
    outstandingCode: '',
    operationCodeType: 'FINANCEMENT4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.BANK_CREDIT_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 9,
    outstandingCode: '',
    operationCodeType: 'DEFINANCMENT3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 10,
    outstandingCode: '',
    operationCodeType: 'DEFINANCMENT4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 11,
    outstandingCode: '',
    operationCodeType: 'FINANCEMENT AUTBA',
    productCode: 'AUTBA',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.BANK_AUTOBALANCE_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 12,
    outstandingCode: '',
    operationCodeType: 'DEFINANCEMT AUTBA',
    productCode: 'AUTBA',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_AUTOBALANCE_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 13,
    outstandingCode: '',
    operationCodeType: 'REGLT IMPAY3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.COVER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 14,
    outstandingCode: '',
    operationCodeType: 'REGLT IMPAY4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.COVER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 15,
    outstandingCode: '',
    operationCodeType: 'REGLT IMPAY CPTANT',
    productCode: 'COMPT',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.COVER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 23,
    outstandingCode: '',
    operationCodeType: 'GESTE COMMERCL 3X',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 24,
    outstandingCode: '',
    operationCodeType: 'GESTE COMMERCL 4X',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 25,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL AUTOB',
    productCode: 'AUTBA',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 26,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL COTCB',
    productCode: 'CAB01',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 27,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL COTCB',
    productCode: 'CAB02',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 28,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL COTCB',
    productCode: 'CAB03',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 29,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL COTCB',
    productCode: 'CAV01',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 30,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL COTCB',
    productCode: 'CAV02',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 31,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL RECOCB',
    productCode: 'CAB01',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.BANK_BILLING_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 32,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL RECOCB',
    productCode: 'CAB02',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 33,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL RECOCB',
    productCode: 'CAB03',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 34,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL RECOCB',
    productCode: 'CAV01',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 35,
    outstandingCode: '',
    operationCodeType: 'GESTE COMCL RECOCB',
    productCode: 'CAV02',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.COVER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 36,
    outstandingCode: '',
    operationCodeType: 'VIRT ENTRE CPT CLT',
    productCode: 'P2PCL',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: true,
    processUnPaid: false,
  },
  {
    ref: 37,
    outstandingCode: '',
    operationCodeType: 'FRAIS FRACTIONMT3X',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 38,
    outstandingCode: '',
    operationCodeType: 'FRAIS FRACTIONMT4X',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 39,
    outstandingCode: '',
    operationCodeType: 'REMBOURSMT FRAIS3X',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.BANK_BILLING_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 40,
    outstandingCode: '',
    operationCodeType: 'REMBOURSMT FRAIS4X',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.BANK_BILLING_ACCOUNT,
    beneficiaryType: BankAccountType.USER_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 41,
    outstandingCode: '',
    operationCodeType: 'FRAIS AUTOBA',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 42,
    outstandingCode: '',
    operationCodeType: 'FRAIS IMPAYE3X',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 43,
    outstandingCode: '',
    operationCodeType: 'FRAIS IMPAYE4X',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '001',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 44,
    outstandingCode: '',
    operationCodeType: 'FRAIS IMPAYE AUTBA',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 45,
    outstandingCode: '',
    operationCodeType: 'COMMI INTERVENTION',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 46,
    outstandingCode: '',
    operationCodeType: 'COTIS CBPHYS CLASS',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 47,
    outstandingCode: '',
    operationCodeType: 'COTIS CBPHYS PREMI',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 48,
    outstandingCode: '',
    operationCodeType: 'COTIS CBPHYS INFIN',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 49,
    outstandingCode: '',
    operationCodeType: 'COTIS CBVIRT CLASS',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 50,
    outstandingCode: '',
    operationCodeType: 'COTIS CBVIRT PREMI',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 51,
    outstandingCode: '',
    operationCodeType: 'COTIS CBVIRT INFIN',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 52,
    outstandingCode: '',
    operationCodeType: 'FRA RETRAIT CBP CL',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 53,
    outstandingCode: '',
    operationCodeType: 'FRA RETRAIT CBP PR',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 54,
    outstandingCode: '',
    operationCodeType: 'FRA RETRAIT CBP IN',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 55,
    outstandingCode: '',
    operationCodeType: 'RECOM CBPHYS CLASS',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 56,
    outstandingCode: '',
    operationCodeType: 'RECOM CBPHYS PREMI',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 57,
    outstandingCode: '',
    operationCodeType: 'RECOM CBPHYS INFIN',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 58,
    outstandingCode: '',
    operationCodeType: 'FRA OPPO CBP CLASS',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 59,
    outstandingCode: '',
    operationCodeType: 'FRA OPPO CBP PREMI',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 60,
    outstandingCode: '',
    operationCodeType: 'FRA OPPO CBP INFIN',
    productCode: 'FRAIS',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.USER_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_BILLING_ACCOUNT,
    checkLimits: false,
    processUnPaid: true,
  },
  {
    ref: 66,
    outstandingCode: '',
    operationCodeType: 'PASS PERTE IMPAYE',
    productCode: 'IMPAY',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.LOSS_ACCOUNT,
    beneficiaryType: BankAccountType.COVER_ACCOUNT,
    checkLimits: false,
    processUnPaid: false,
  },
  {
    ref: 67,
    outstandingCode: '',
    operationCodeType: 'PASS PERTE ENCOURS',
    productCode: 'DF003',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.LOSS_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: false,
  },
  {
    ref: 68,
    outstandingCode: '',
    operationCodeType: 'PASS PERTE ENCOURS',
    productCode: 'DF004',
    countryCode: 'FRA',
    subscriptionMontlyNumber: '000',
    senderType: BankAccountType.LOSS_ACCOUNT,
    beneficiaryType: BankAccountType.BANK_CREDIT_ACCOUNT,
    checkLimits: false,
    processUnPaid: false,
  },
];