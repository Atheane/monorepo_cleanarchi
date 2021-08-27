import { describe, beforeAll, it, afterEach } from '@jest/globals';
import { ConfigService } from '@oney/env';
import * as sinon from 'sinon';
import * as path from 'path';
import { compile } from '.';
import fixtures from './index.fixtures';

describe('[compiler]', () => {
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

  describe('compile', () => {
    it('Should correctly compile a template with a payload', async () => {
      const res = await compile(fixtures.payload, fixtures.config, 'odb_payment_topic');

      expect(res).toEqual(expect.objectContaining({ content: fixtures.success }));
    });

    it('Should throw an error if the target template does not exist', async () => {
      let error;

      try {
        await compile(fixtures.payload, fixtures.wrongConfig, 'dummy_topic');
      } catch (err) {
        error = err;
      }

      expect(error.message).toContain('ENOENT: no such file or directory');
    });
  });
});
