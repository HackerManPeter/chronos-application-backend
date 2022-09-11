import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: { email: string; password: string }) {
    return this.authService.login(user);
  }
}
