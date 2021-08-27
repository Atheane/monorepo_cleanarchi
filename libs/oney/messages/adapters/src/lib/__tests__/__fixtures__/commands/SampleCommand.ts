import { Command, DecoratedCommand } from '@oney/messages-core';

@DecoratedCommand({ namespace: '@oney/test', name: 'sample-command', version: 0 })
export class SampleCommand implements Command {
  public id: string;
  public props: any;
}
