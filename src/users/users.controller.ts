import { Body, Controller, Param, Post, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}
  @Post('signup')
  async createNewUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.createUser(name, email, password);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
