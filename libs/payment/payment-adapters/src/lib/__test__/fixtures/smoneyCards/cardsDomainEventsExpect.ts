import { uuidv4Regex } from '../helpers/uuidv4regex';

export const cardsDomainEventsExpect = {
  cardCreated: {
    body:
      '{"id":"card-UojzbeMuR","ref":"1286900002wQel8z6Xn0yZspnpqEdjkg","ownerId":"zCDOH_UvA",' +
      '"pan":"9396XXXXXXXX7375","type":"physical_classic","status":"sent","hasPin":false,' +
      '"preferences":{"blocked":false,"foreignPayment":true,"internetPayment":true,' +
      '"atmWeeklyUsedAllowance":0,"monthlyUsedAllowance":0,"atmWeeklyAllowance":300,' +
      '"monthlyAllowance":3000}}',
    messageId: expect.stringMatching(uuidv4Regex),
    partitionKey: expect.stringMatching(uuidv4Regex),
    label: 'CARD_CREATED',
    userProperties: { version: 1 },
  },
  cardUpdated: {
    body:
      '{"id":"card-BjHjzuN5V","ref":"1286900002JkUHA0eMj0emobEJBodlhg","ownerId":"zCDOH_UvA",' +
      '"pan":"9396XXXXXXXX2549","hasPin":false,"status":"activated","type":"physical_classic",' +
      '"preferences":{"blocked":false,"foreignPayment":true,"internetPayment":true,' +
      '"atmWeeklyUsedAllowance":0,"monthlyUsedAllowance":389,"atmWeeklyAllowance":250,"monthlyAllowance":850}}',
    messageId: expect.stringMatching(uuidv4Regex),
    partitionKey: expect.stringMatching(uuidv4Regex),
    label: 'CARD_UPDATED',
    userProperties: { version: 1 },
  },
};
