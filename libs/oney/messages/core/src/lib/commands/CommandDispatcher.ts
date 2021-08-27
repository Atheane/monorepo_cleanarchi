import { injectable } from 'inversify';
import { Command } from './Command';
import { CommandMessageBodyMapper } from './CommandMessageBodyMapper';
import { CommandMessageBodySerializer } from './CommandMessageBodySerializer';
import { Dispatcher } from '../common/Dispatcher';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommandDispatcherOptions {
  customMapper?: CommandMessageBodyMapper;
  customSerializer?: CommandMessageBodySerializer;
  /**
   * @property The date and time in UTC at which the message will
   * be enqueued. This property returns the time in UTC; when setting the property, the
   * supplied DateTime value must also be in UTC. This value is for delayed message sending.
   * It is utilized to delay messages sending to a specific time in the future. Message enqueuing
   * time does not mean that the message will be sent at the same time. It will get enqueued,
   * but the actual sending time depends on the queue's workload and its state.
   */
  scheduledEnqueueTimeUtc?: Date;
}

@injectable()
export abstract class CommandDispatcher<TCommand extends Command = Command> extends Dispatcher<
  TCommand,
  CommandDispatcherOptions
> {}
