import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from '../orders/orders.schema';
import { UserController } from './users.controller';
import { userSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Order', schema: orderSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
