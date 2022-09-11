import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({
    default: 1,
    validate(value: number) {
      if (value < 1) throw new BadRequestException();
    },
  })
  quantity: number;

  @Prop({
    required: true,
    validate(value: number) {
      if (value < 1) throw new BadRequestException();
    },
  })
  price: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
