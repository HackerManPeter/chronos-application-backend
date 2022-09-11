import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderController } from './orders.controller';
import { orderSchema } from './orders.schema';
import { OrderService } from './orders.service';
import { productSchema } from './products.schema';
import { userSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: orderSchema },
      { name: 'Product', schema: productSchema },
      { name: 'User', schema: userSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
