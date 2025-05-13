import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dtos/LoginDto';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-auth') {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const loginDto = plainToInstance(LoginDto, { email, password });
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const user = await this.usersService.validateUserCredentials(
      email,
      password,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
