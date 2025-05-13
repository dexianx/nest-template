import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from 'src/guards/jwt-guard';
import { GoogleStrategy } from './strategies/oauth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, JwtGuard],
  imports: [UsersModule, JwtModule.register({}), PassportModule],
  exports: [JwtGuard],
})
export class AuthModule {}
