import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sgMail = require('@sendgrid/mail');

import { OrderDocument } from './orders.schema';
import { ProductDocument } from './products.schema';
import { UserDocument } from 'src/users/users.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createOrder(
    items: { name: string; quantity: number; price: number }[],
    email: string,
  ) {
    let total = 0;
    items.forEach((value, index) => {
      total += value.price;
      items[index] = new this.productModel({ ...value });
    });
    const user = await this.userModel.findOne({ email });
    const order = new this.orderModel({
      // items,
      items,
      total,
      completed: false,
      owner: user._id,
    });
    try {
      const result = await order.save();
      try {
        await this.sendMail(email, order.items);
      } catch (e) {
        throw new InternalServerErrorException('failed email');
      }
      return result;
    } catch (e) {
      throw new BadRequestException('Invalid data');
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.orderModel.find({});
      return orders;
    } catch {
      throw new ServiceUnavailableException('Please try again later');
    }
  }

  async getSingleOrder(id: string) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) throw new BadRequestException('Invalid request');
      return order;
    } catch {
      throw new BadRequestException('Invalid request');
    }
  }

  async deleteSingleOrder(id: string) {
    try {
      const order = await this.orderModel.findByIdAndDelete(id);
      if (!order) throw new BadRequestException('Invalid request');
      return order;
    } catch {
      throw new BadRequestException('Invalid request');
    }
  }

  async sendMail(
    email: string,
    items: { name: string; quantity: number; price: number }[],
  ) {
    const itemNames = items.map((v) => v.name);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log(' I ran');
    const msg = {
      to: `${email}`,
      from: process.env.EMAIL,
      subject: 'Order Confirmation',
      text: `We have success fully received your order for Processing. In case this was not you, kindly reach out to us through the email above
      Details of your order include: ${itemNames.join(', ')}`,
    };
    try {
      await sgMail.send(msg);
    } catch (e) {
      throw new InternalServerErrorException('Unable to send email');
    }
  }
}
