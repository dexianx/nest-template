import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dtos/SignUpDto';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from 'src/guards/local-guard';
import { JwtGuard } from 'src/guards/jwt-guard';
import { OAuthGuard } from 'src/guards/oauth-guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(PassportLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.signToken(req.user);
  }

  @Post('sign-up')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @UseGuards(OAuthGuard)
  @Get('google/login')
  async googleLogin() {

  }

  @UseGuards(OAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Request() req) {
    const user = req.user;

    if (!user.profileCompleted) {
      return {
        status: 'incomplete-profile',
        message: 'Redirect user to complete profile',
        redirectUrl: '/complete-profile',
      };
    }

    return this.authService.signToken(user);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user;
  }
}
