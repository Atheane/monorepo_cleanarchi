import { defaultLogger } from '@oney/logger-adapters';
import { injectable } from 'inversify';
import { Body, Get, JsonController, Param, Put, UseAfter, UseBefore } from 'routing-controllers';
import { PreferencesDomainErrorMiddleware } from './PreferencesDomainErrorMiddleware';
import { UpdatePreferencesDto } from './UpdatePreferencesDto';
import { PreferencesResponseDto } from './PreferencesResponseDto';
import { getKernelDependencies } from '../../di/config.kernel';
import { AuthorizationTokenMiddleware } from '../../middlewares/token.middleware';
import { UserMiddleware } from '../../middlewares/user.middleware';
import { UpdatePreferencesCommand } from '../../usecase/preferences/UpdatePreferences';
import { GetRecipient } from '../../usecase/recipient/GetRecipient';

@JsonController('/preferences')
@UseBefore(AuthorizationTokenMiddleware)
@UseAfter(PreferencesDomainErrorMiddleware)
@injectable()
export class PreferencesController {
  constructor(private readonly getRecipient: GetRecipient) {}

  @Get('/:uid')
  @UseBefore(UserMiddleware)
  async getPreferences(@Param('uid') uid: string): Promise<PreferencesResponseDto> {
    defaultLogger.info(`get notification preferences for user ${uid}`);
    const {
      props: { preferences },
    } = await this.getRecipient.execute({ uid });
    const { allowTransactionNotifications, allowAccountNotifications } = preferences;
    return {
      uid,
      allowAccountNotifications,
      allowTransactionNotifications,
    };
  }

  @Put('/:uid')
  @UseBefore(UserMiddleware)
  async updatePreferences(
    @Param('uid') uid: string,
    @Body() req: UpdatePreferencesDto,
  ): Promise<PreferencesResponseDto> {
    defaultLogger.info(`update notification preferences for user ${uid}`);
    const { allowAccountNotifications, allowTransactionNotifications } = req;
    const updatePreferencesRequest: UpdatePreferencesCommand = {
      uid,
      preferences: {
        allowAccountNotifications,
        allowTransactionNotifications,
      },
    };
    const { updatePreferences } = getKernelDependencies();
    const {
      props: { preferences },
    } = await updatePreferences.execute(updatePreferencesRequest);
    return {
      uid,
      allowAccountNotifications: preferences.allowAccountNotifications,
      allowTransactionNotifications: preferences.allowTransactionNotifications,
    };
  }
}
