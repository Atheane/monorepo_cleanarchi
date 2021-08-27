import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getKernelDependencies } from '../../../config/Setup';

@Injectable()
export class UserIdGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userToken = request.headers.authorization.split(/\s+/g)[1];
    const { params } = request;
    const dependencies = await getKernelDependencies();
    return dependencies.checkUserId.execute({ userId: params.userId, userToken });
  }
}
