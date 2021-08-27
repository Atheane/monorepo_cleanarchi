import { ProfileGenerator } from '@oney/profile-adapters';
import { ProfileStatus } from '@oney/profile-messages';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import * as nock from 'nock';
import { jest } from '@jest/globals';
import { DocumentGenerator } from '@oney/document-generator';
import * as path from 'path';
import * as fs from 'fs';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

describe('Get contract api testing', () => {
  let userToken: string;
  let container: Container;
  let userId: string;
  let identityEncode: EncodeIdentity;
  let profileGenerator: ProfileGenerator;

  let spyDocumentGeneratorGetData;
  let spyDocumentGeneratorGenerate;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    identityEncode = container.get(EncodeIdentity);
    profileGenerator = container.get(ProfileGenerator);

    spyDocumentGeneratorGenerate = jest
      .spyOn(DocumentGenerator.prototype, 'generate')
      .mockImplementation(() => Promise.resolve(new DocumentGenerator('', true)));

    spyDocumentGeneratorGetData = jest
      .spyOn(DocumentGenerator.prototype, 'getData', 'get')
      .mockImplementation(() => Promise.resolve(Buffer.from('')));

    await initRouter(app, envPath);
  });

  beforeEach(() => {
    spyDocumentGeneratorGetData.mockClear();
    spyDocumentGeneratorGenerate.mockClear();
  });

  it('Should reject request if the user is not authorized', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const profile = await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    userToken = await identityEncode.execute({
      uid: profile.props.uid,
      email: profile.props.email,
      provider: IdentityProvider.odb,
    });

    await request(app)
      .get('/profile/wrong_user/contract')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401);
  });

  it('should get contract', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const profile = await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    userToken = await identityEncode.execute({
      uid: profile.props.uid,
      email: profile.props.email,
      provider: IdentityProvider.odb,
    });

    const result = await request(app)
      .get(`/profile/${userId}/contract`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(result.body).toBeTruthy();
  });

  it('Should get a signed contract', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    await profileGenerator.afterContractStepSnapshot(userId);

    const file = path.resolve(__dirname, 'fixtures/getContract/contract.fixtures.pdf');

    const nockFile = nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get(`/documents/${userId}%2Fcontract%2Fcontract.pdf`)
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await request(app)
      .get(`/profile/${userId}/contract`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(result.body).toBeInstanceOf(Buffer);
    expect((<Buffer>result.body).includes(fs.readFileSync(file))).toBe(true);
    nockFile.done();
  });
});
