import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule, PassportModule],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    exports: [AuthService],
})
export class AuthModule {}