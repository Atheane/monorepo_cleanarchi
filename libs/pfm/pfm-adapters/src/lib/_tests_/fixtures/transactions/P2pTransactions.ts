import { P2pProperties } from '@oney/pfm-core';

export const P2pTransactions: P2pProperties[] = [
  {
    id: 'bc74ca67-04be-497c-af42-ef5ac6f64893',
    beneficiary: {
      id: '1388',
      iban: 'iban_value',
      fullname: 'John Doe',
    },
    sender: {
      id: '456',
      iban: 'iban_value',
      fullname: 'Jane Doe',
    },
    date: new Date('2020-09-03T08:23:13.512Z'),
    amount: 1000,
    message: 'p2p received',
    orderId: 'gaerh',
    tag: {
      generateUnpaid: false,
      verifyLimits: false,
      generatedTag: 'tag_value',
    },
  },
  {
    id: '022c6c07-134a-4371-a87a-1dc2f6d053a6',
    beneficiary: {
      id: '123',
      iban: 'iban_value',
      fullname: 'John Doe',
    },
    sender: {
      id: '1388',
      iban: 'iban_value',
      fullname: 'Jane Doe',
    },
    date: new Date('2020-10-01T08:23:13.512Z'),
    amount: 1000,
    message: 'p2p sent',
    orderId: 'gfga',
    tag: {
      generateUnpaid: false,
      verifyLimits: false,
      generatedTag: 'tag_value',
    },
  },
  {
    id: '2a166195-e81c-4d49-9bd3-85c32a643634',
    beneficiary: {
      id: 'not_assigned',
      iban: 'iban_value',
      fullname: 'John Doe',
    },
    sender: {
      id: 'not_assigned_either',
      iban: 'iban_value',
      fullname: 'Jane Doe',
    },
    date: new Date('2020-10-01T08:23:13.512Z'),
    amount: 1000,
    message: 'p2p not assigned',
    orderId: 'abc',
    tag: {
      generateUnpaid: false,
      verifyLimits: false,
      generatedTag: 'tag_value',
    },
  },
];
