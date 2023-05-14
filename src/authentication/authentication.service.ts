import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';

export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPasword = await bcrypt.hash(registrationData.password, 10);
    console.log(
      'file: authentication.service.ts:19  register  hashedPasword:',
      this.usersService,
    );

    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPasword,
      });
      console.log(
        'file: authentication.service.ts:25  register  createdUser:',
        createdUser,
      );
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email  already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(error);
      throw new HttpException(
        'Something went wrong,',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      hashedPassword,
      plainTextPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(user.password, hashedPassword);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
