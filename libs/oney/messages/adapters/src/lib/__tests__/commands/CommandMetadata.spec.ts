import { Command, DecoratedCommand } from '@oney/messages-core';
import 'reflect-metadata';

describe('CommandMetadata', () => {
  it('two command with same definition should throw an error', async () => {
    const execute = () => {
      class SampleCommand1 implements Command {
        public id: string;
        public props: any;
      }

      class SampleCommand2 implements Command {
        public id: string;
        public props: any;
      }

      DecoratedCommand({ namespace: '@oney/test', name: 'sample-command', version: 0 })(SampleCommand1);
      DecoratedCommand({ namespace: '@oney/test', name: 'sample-command', version: 0 })(SampleCommand2);
    };

    expect(execute).toThrow();
  });
});
