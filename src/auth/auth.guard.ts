import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('You are not logged in');
    }

    const [bearer, accessToken] = authHeader.split(' ');
    const user = this.authService.validateAccessToken(accessToken);

    if (bearer !== 'Bearer' || !user) {
      throw new UnauthorizedException(
        'Your access token is invalid or has expired',
      );
    }

    return true;
  }
}
