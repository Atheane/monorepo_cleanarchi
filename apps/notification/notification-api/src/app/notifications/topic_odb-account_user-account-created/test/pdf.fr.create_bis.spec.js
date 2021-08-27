import * as sinon from 'sinon';
import { ConfigService } from '@oney/env';
import { describe, beforeAll, it, afterEach } from '@jest/globals';
import * as path from 'path';
import fixtures from './pdf.fr.create_bis.mock';
import { success } from './data';
import { processMessage } from '../../../services/receiver';
import notifier from '../../../services/notifier';

describe('[notifications]', () => {
  let sandbox;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../../../_test_/env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    // const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('create an HTML RIB document using an HTML compiler', () => {
    it('notifier/pdf should receive compiled HTML when topic is topic_odb-account_user-account-created', async () => {
      sandbox.stub(notifier, 'pdf').value(success);
      const TOPIC_BUS_NAME = 'topic_odb-account_user-account-created';
      await processMessage({ body: fixtures.message }, TOPIC_BUS_NAME);
      expect(notifier.pdf).toEqual(fixtures.success);
    });

    it('Should throw an error if the target/path template does not exist', async () => {
      const sendStub = sandbox.stub(notifier, 'pdf');
      const TOPIC_BUS_NAME = 'dummy_topic';
      await processMessage({ body: fixtures.message }, TOPIC_BUS_NAME);
      expect(sendStub.callCount).toEqual(0);
    });
  });
});
