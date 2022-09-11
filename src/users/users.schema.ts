import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Order } from '../orders/orders.schema';
import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    unique: true,
    required: true,
    validate(value: string) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid');
    },
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,

    validate(value: string) {
      if (value.length <= 6)
        throw new Error('Password length must be more than 6 characters');
      if (value.toLowerCase().includes('password'))
        throw new Error("Password cannot contain the word 'password'");
    },
  })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orders: Order[];
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
