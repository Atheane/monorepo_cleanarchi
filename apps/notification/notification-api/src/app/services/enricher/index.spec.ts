import { describe, beforeAll, it, afterEach } from '@jest/globals';
import { ConfigService } from '@oney/env';
import * as sinon from 'sinon';
import * as path from 'path';
import { enrich } from '.';
import * as fetchers from '../fetchers';

describe('[enricher]', () => {
  let sandbox;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../../_test_/env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    // const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('enrich', () => {
    it('Should correctly enrich the message using the configuration', async () => {
      const message = { uid: 'abcde123', some: 'other_fields' };
      const config = {
        type: 'email',
        name: 'email.fr.create_transfer',
        enrich: [
          {
            resource: 'odbAccount/user',
            identifier: 'uid',
            fields: ['user_profile.firstname', 'user_profile.lastname', 'email'],
            as: 'user',
          },
        ],
        recipient: 'user.email',
      };

      const fetcherStub = sinon.stub(fetchers.default.odbAccount, 'user').resolves({
        user_profile: {
          firstname: 'Samy',
          lastname: 'Ouachek',
        },
        email: 'samy.ouachek@domain.com',
      });

      const res = await enrich(message, config);

      expect(fetcherStub.args).toEqual(
        expect.objectContaining([['abcde123', ['user_profile.firstname', 'user_profile.lastname', 'email']]]),
      );
      expect(res).toEqual(
        expect.objectContaining({
          user: {
            user_profile: {
              firstname: 'Samy',
              lastname: 'Ouachek',
            },
            email: 'samy.ouachek@domain.com',
          },
        }),
      );
    });
  });
});
