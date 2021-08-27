import 'reflect-metadata';
import { Application } from 'express';
import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { getUserWithPhoneToken } from './fixtures/auth.fixtures';
import { bootstrap } from './fixtures/bootstrap';

const app: Application = express();

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        name: 'AzureBus',
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          addRule: jest.fn(),
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
            receiveMessages: jest.fn().mockReturnValue([]),
          }),
        }),
      }),
    },
  };
});

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/partner`);
nockBack.setMode('record');

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => {
    const { of: currentOffset } = queryString.parse(`?${body}`);
    const { of: recordedOffset } = queryString.parse(`?${body}`);
    if (!(currentOffset || recordedOffset)) {
      // Just replace the saved body by a new one
      // eslint-disable-next-line no-param-reassign
      delete aRecordedBody.orderid;
      return aRecordedBody;
    }
    if (currentOffset === recordedOffset) {
      return aRecordedBody;
    }
    return body;
  };
};

describe('Partners integration api testing', () => {
  let azureAdToken: string;
  let notAuthorizeToken: string;
  let userToken: string;
  let userId: string;
  let userWithPhoneToken: string;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    const container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    userWithPhoneToken = await getUserWithPhoneToken(container);

    notAuthorizeToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMi0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjA3NjEyNTc3LCJuYmYiOjE2MDc2MTI1NzcsImV4cCI6MTYwNzYxNjQ3NywiYWlvIjoiRTJSZ1lIRGV3ZXNxZkZpQzgrSGpid1ZNNjk5bUFRQT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInN1YiI6IjZmYWRlNTBmLWVmMjMtNDJmNi1iM2U4LWFiMmY5YjEwN2Y4NiIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OSIsInV0aSI6Imc3YWxoeWMxQ1VDRnMxaWZfd193QUEiLCJ2ZXIiOiIxLjAifQ.EX65LD32pXsovox2IFBlL7EwYPefKEUMQQLXdP2-7qPw3uPFePRG2XUj5ms6fPcz4yZaRgNoyyI8SrD2YVRDu2taEuhzC1aGmTyapT53nPuI4ngV3VJdnZCC9HmPfhUTbh1lLxOXHEcZkwUo9zjow2j99gQjTeqS3VHx64EtDOBa2uCoM_snA-Xwp08a4Fi6XmKAHprWRTGyrO0QMmtWVU2H2MSpSArALOqRcTRGwHdW1UzkA4-_zw6PN-hZQMm0vdkClezK85QJMMLtnGLt-eJXVYq3-7oT2OLTtB1IZi9IqL1XSPQoPPgQwYOx1NEFM-CBvVvD2u1D-N14HxNKSg';
    azureAdToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJhcGk6Ly83MTBmMWRhNS1lYzNjLTQ0MzUtYTYyMS04YmQ2MjA0MjgwNzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkvIiwiaWF0IjoxNjEyMjU0NjI0LCJuYmYiOjE2MTIyNTQ2MjQsImV4cCI6MTYxMjI1ODUyNCwiYWlvIjoiRTJaZ1lQRE5YbEZ4dHBXMXlETG9yNlB4NlZ1bkFBPT0iLCJhcHBpZCI6IjJmY2MzNWE3LTZlNDktNDQzNC1hMDgwLTZiNTczNTJjN2EyMyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFjYmNmYzViLWJmYzQtNDZjZi05ZGQxLWI2MTE0MDMwOWI5OS8iLCJvaWQiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJyaCI6IjAuQVJFQVdfeThITVNfejBhZDBiWVJRRENibWFjMXpDOUpialJFb0lCclZ6VXNlaU1SQUFBLiIsInJvbGVzIjpbImF1dGhlbnRpY2F0aW9uLndyaXRlLmFsbCIsImF1dGhlbnRpY2F0aW9uLndyaXRlLnNlbGYiLCJhdXRoZW50aWNhdGlvbi5yZWFkLmFsbCIsImF1dGhlbnRpY2F0aW9uLnJlYWQuc2VsZiJdLCJzdWIiOiI2ZmFkZTUwZi1lZjIzLTQyZjYtYjNlOC1hYjJmOWIxMDdmODYiLCJ0aWQiOiIxY2JjZmM1Yi1iZmM0LTQ2Y2YtOWRkMS1iNjExNDAzMDliOTkiLCJ1dGkiOiJleHFLTHZjRy1FYUFyRzVfREUxNkFBIiwidmVyIjoiMS4wIn0.AWI6AwDt1cVNcVwudKcKJsnimhSvBfUqTLzkXawE4QncaxTPPAN7JG-h3evDkRs7n8sr_uxEzeZWaxV94J2OQZ0sN7HtvsmIu0cnISK-ouGm41vEioxf_f303EEKi2y8YJDVT3tXHAyFx48bWiZCMh713ZgjDlBJXMSySSyFnxWOJZbxZYpHD6zsl5_J8Qmr_NnMkP-U0lnmRoJoB-vNP-4XavpBd0JVYwmd8lysHPaIGWf8wXLmEhTGOHdYGNkhp1_im3C4DC6s-FW7IQfp6uAh80hJ4In0IesfYj9MvqsYbLW4D2fTyU4nz0uVJzBnyzx-3EJDD3ZwpIpv63G87A';
  });

  it('Should retrieve a 401 cause azure ad token not provided', async () => {
    const { nockDone } = await nockBack('tokenAdNotProvided.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app).get('/authentication/partner/token/zefzef').expect(401);
    nockDone();
  });

  it('Should create a user with azure token ad', async () => {
    const email = 'toto@aao.com';
    const { nockDone } = await nockBack('checkAzureAdOnCreateUser.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .post('/authentication/partner/user')
      .send({
        email,
        associateProfil: false,
      })
      .set('Authorization', `Bearer ${azureAdToken}`)
      .expect(response => {
        expect(response.body.phone).toBeFalsy();
        expect(response.headers['user_token']).toBeTruthy();
        userId = response.body.uid;
      });

    nockDone();
  });

  it('Should retrieve a user created and retrieve a token', async () => {
    const { nockDone } = await nockBack('checkAzureAdOnCreateAndRetrieve.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .get(`/authentication/partner/token/${userId}`)
      .set('Authorization', `Bearer ${azureAdToken}`)
      .expect(200)
      .expect(response => {
        userToken = response.headers['user_token'];
        expect(response.headers['user_token']).toBeTruthy();
      });
    nockDone();
  });

  it('should return 401 cause user is not autorize to access authentication service', async () =>
    request(app).get('/authentication/user').set('Authorization', `bearer ${userToken}`).expect(401));

  it('should return 401 cause user try to access partner service create user', async () => {
    const email = 'toto@aao.com';
    await request(app)
      .post('/authentication/partner/user')
      .send({
        email,
        associateProfil: false,
      })
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(401);
  });

  it('should return 401 cause usser try to access partner service get token', async () => {
    await request(app)
      .get(`/authentication/partner/token/${userId}`)
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(401);
  });

  it('should return 401 cause user is not autorize to access authentication service', async () =>
    request(app).get('/authentication/user').set('Authorization', `bearer ${userToken}`).expect(401));

  it('Should return 401 cause token not listed in service authentication', async () => {
    await request(app)
      .get(`/authentication/partner/token/${userId}`)
      .set('Authorization', `Bearer ${notAuthorizeToken}`)
      .expect(401);
  });
});
