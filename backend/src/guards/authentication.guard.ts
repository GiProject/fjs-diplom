import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthenticatedGuard extends AuthGuard('local') implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        return request.isAuthenticated();
    }
}