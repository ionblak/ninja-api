import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { response, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { RequestWithUser } from './requestWithUser.interface';

@Controller('authentication')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return await this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader(
      'Set-cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }
}
