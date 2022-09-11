import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/users.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return { name: user.name, email: user.email}
    }
    return null;
  }

  async login(user: { email: string; password: string }) {
    const { email, password } = user;
    const authorisedUser = await this.validateUser(email, password);

    if (!authorisedUser) throw new UnauthorizedException();

    const jwt = await this.jwtService.signAsync({ user });

    return { user: authorisedUser, token: jwt };
  }
}
