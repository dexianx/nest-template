import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword } from 'src/utils/hash.utils';
import { FindOrCreateOauthUserDto } from './dtos/findOrCreateOauthUserDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data });
  }

  async validateUserCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user?.isOAuthUser) {
      throw new BadRequestException(
        'This account is registered via OAuth. Please log in using OAuth.',
      );
    }

    if (user?.password && (await comparePassword(user.password, password))) {
      return {
        userId: user.user_id,
        email: user.email,
      };
    }
    return null;
  }

  async findOrCreateOAuthUser(data: FindOrCreateOauthUserDto) {
    const { email, ...rest } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      if (!user.isOAuthUser) {
        throw new UnauthorizedException(
          'This email is already registered using a password login',
        );
      }
      return user;
    }

    return this.prisma.user.create({
      data: {
        email,
        ...rest,
        isOAuthUser: true
      },
    });
  }
}
