import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users/users.schema';
import { BadRequestException } from '@nestjs/common';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

import { Product } from './products.schema';
export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  items: Product[];
  @Prop({
    required: true,
    validate(value: number) {
      if (value < 0)
        throw new BadRequestException(' Total cannot be less than 0');
    },
  })
  total: number;
  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const orderSchema = SchemaFactory.createForClass(Order);
