import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import { Usecase } from '@oney/ddd';
import { BusDelivery } from '@oney/pfm-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { UserRepository } from '../../domain/repositories';
import { IAppConfiguration } from '../../domain/models/IAppConfiguration';

export interface ProcessMonthlyStatementsCommands {
  date: Date;
}

@injectable()
export class ProcessMonthlyStatements implements Usecase<ProcessMonthlyStatementsCommands, void> {
  constructor(
    @inject(PfmIdentifiers.userRepository) private readonly userRepository: UserRepository,
    @inject(PfmIdentifiers.busDelivery) private readonly busDelivery: BusDelivery,
    @inject(PfmIdentifiers.configuration) private readonly appConfiguration: IAppConfiguration,
  ) {}

  async execute(request: ProcessMonthlyStatementsCommands): Promise<void> {
    const date = moment(request.date).startOf('month');
    console.log(`Process Monthly Statement begin for ${date.format('MM/YYYY')}`);
    const verifiedUser = await this.userRepository.getAllVerifiedUser();
    const userIds = verifiedUser.map(user => user.uid);
    await this.busDelivery.send(this.appConfiguration.eventsConfig.generateStatementTopic, {
      date: date.toDate(),
      userIds,
    });
    console.log(`Process Monthly Statement end for ${date.format('MM/YYYY')}`);

    return;
  }
}
