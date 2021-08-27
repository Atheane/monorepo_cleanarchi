import {
  MessagingError,
  ReceiveMode,
  Receiver,
  ServiceBusClient,
  ServiceBusMessage,
  SubscriptionClient,
  TopicClient,
} from '@azure/service-bus';
import { Logger } from '@oney/logger-core';
import { EventErrors, EventMetadata } from '@oney/messages-core';
import { injectable } from 'inversify';
import { errorFormatter } from './errorFormatter';
import { AzureServiceBusHandler, ServiceBus } from './ServiceBus';

/* istanbul ignore next */
@injectable()
export class AzureServiceBus extends ServiceBus<SubscriptionClient, TopicClient> {
  private _subscription: string;
  private _serviceBusClient: ServiceBusClient;
  private _logger: Logger;

  private _subscriptionClientByTopic: Map<string, SubscriptionClient>;
  private _receiverByTopic: Map<string, Receiver>;
  private _handlersByTopic: Map<string, any[]>;

  constructor(url: string, sub: string, logger: Logger) {
    super();
    this.init(url, sub);

    this._logger = logger;
  }

  private init(url: string, sub: string) {
    if (!url) {
      throw new EventErrors.EventBusUrlEmpty('url cannot be empty');
    }
    this._serviceBusClient = ServiceBusClient.createFromConnectionString(url);
    this._subscription = sub;

    this._subscriptionClientByTopic = new Map<string, SubscriptionClient>();
    this._receiverByTopic = new Map<string, Receiver>();
    this._handlersByTopic = new Map<string, any[]>();
  }

  private ensureHandlersMapEntry(topic: string) {
    let entry = this._handlersByTopic.get(topic);

    if (!entry) {
      entry = [];
      this._handlersByTopic.set(topic, entry);
    }

    return entry;
  }

  createChannel(channel: string): TopicClient {
    return this._serviceBusClient.createTopicClient(channel);
  }

  ensureSubscriptionInstance(topic: string): SubscriptionClient {
    let subscriptionInstance = this._subscriptionClientByTopic.get(topic);
    if (!subscriptionInstance) {
      subscriptionInstance = this._serviceBusClient.createSubscriptionClient(topic, this._subscription);
      this._subscriptionClientByTopic.set(topic, subscriptionInstance);
    }
    return subscriptionInstance;
  }

  async ensureSubscriptionRule(topic: string, metadata: EventMetadata): Promise<void> {
    this._logger.info(`Ensure subscription rule for topic: ${topic} on subscription: ${this._subscription}`, {
      topic,
      subscription: this._subscription,
      metadata,
    });

    const subscriptionInstance = this.ensureSubscriptionInstance(topic);

    try {
      /** Thanks to that, we configure the handler for only listen on eventName */
      const rules = await subscriptionInstance.getRules();
      const rulesName = rules.map(item => item.name);

      if (!rulesName.includes(metadata.name)) {
        await subscriptionInstance.addRule(metadata.name, {
          label: metadata.name,
          // userProperties: {
          //   version: metadata.version,
          // },
        });
      }
    } catch (e) {
      // TODO this is not a good try / catch
      this._logger.error(
        `An error occurred while try to add new subscription rule on topic: ${subscriptionInstance.topicName}`,
        e,
      );
    }
  }

  ensureReceiver(subscriptionInstance: SubscriptionClient): Receiver {
    const topic = subscriptionInstance.topicName;

    let receiver = this._receiverByTopic.get(topic);
    if (!receiver) {
      receiver = subscriptionInstance.createReceiver(ReceiveMode.peekLock);

      const getLogBaseMetadata = () => {
        return {
          topic,
          subscription: this._subscription,
          messageCount: this._handleMessageCount,
        };
      };

      receiver.registerMessageHandler(
        async (message: ServiceBusMessage) => {
          try {
            this._handleMessageCount++;

            this._logger.info(
              `Handle message: ${message.label} from topic ${topic} for subscription: ${this._subscription}`,
              {
                ...getLogBaseMetadata(),
                message: this.getMessageSafeProps(message),
              },
            );

            let shouldCompleteMessage = true;

            const handlers = this.ensureHandlersMapEntry(topic);
            for (const handler of handlers) {
              this._logger.debug(`Call handler ${handler.constructor.name}`, {
                ...getLogBaseMetadata(),
                message: this.getMessageSafeProps(message),
              });
              const result = await handler.handle(message);
              if (!result) {
                shouldCompleteMessage = false;
              }
            }

            if (shouldCompleteMessage) {
              this._logger.info(
                `Complete message: ${message.label} from topic ${topic} for subscription: ${this._subscription}`,
                {
                  ...getLogBaseMetadata(),
                  message: this.getMessageSafeProps(message),
                },
              );
              await message.complete();
            } else {
              this._logger.warn(
                `Abandon message: ${message.label} from topic ${topic} for subscription: ${this._subscription}`,
                {
                  ...getLogBaseMetadata(),
                  message: this.getMessageSafeProps(message),
                },
              );
              await message.abandon();
            }
          } catch (error) {
            this._logger.error(`onMessage: Error occurred while handling message: ${message.label}`, {
              ...getLogBaseMetadata(),
              error: errorFormatter(error),
            });
            throw error;
          } finally {
            this._handleMessageCount--;
          }
        },
        (error: MessagingError) => {
          this._logger.error(`onError: Error occurred while receiving message on topic ${topic}`, {
            ...getLogBaseMetadata(),
            error: errorFormatter(error),
          });
        },
        {
          autoComplete: false,
          maxMessageAutoRenewLockDurationInSeconds: 10,
          maxConcurrentCalls: 10,
        },
      );

      this._receiverByTopic.set(topic, receiver);
    }
    return receiver;
  }

  private _handleMessageCount = 0;

  async addSubscription(topic: string, handler: AzureServiceBusHandler): Promise<void> {
    const subscriptionInstance = this.ensureSubscriptionInstance(topic);

    const handlers = this.ensureHandlersMapEntry(topic);
    handlers.push(handler);

    this.ensureReceiver(subscriptionInstance);
  }

  private getMessageSafeProps(message: ServiceBusMessage) {
    return {
      label: message.label,
      userProperties: message.userProperties,
    };
  }
}
