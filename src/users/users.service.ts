import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    try {
      const user = new this.userModel({ name, email, password });
      const result = await user.save();
      return result;
    } catch {
      throw new BadRequestException('Invalid request');
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch {
      throw new BadRequestException('Invalid request');
    }
  }

  async findUser(id: string) {
    try {
      const user = this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not Found');
      return user;
    } catch {
      throw new BadRequestException('Bad request');
    }
  }
}
