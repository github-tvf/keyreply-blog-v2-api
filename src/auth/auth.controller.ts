import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignUpUserDto } from './dtos/signup-user.dto';
import { AuthenticatedUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const { access_token } = await this.authService.login(req.user);

    return {
      ...req.user,
      access_token,
    };
  }

  @Post('signup')
  async signUp(@Body() payload: SignUpUserDto) {
    const user = await this.authService.signUp(
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName,
    );

    const { access_token } = await this.authService.login(user);
    return {
      ...user,
      access_token,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
