import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOrder(
    @Body()
    body: {
      items: { name: string; quantity: number; price: number }[];
      email: string;
    },
  ) {
    const result = await this.orderService.createOrder(body.items, body.email);
    return result;
  }

  @UseGuards(JwtGuard)
  @Get()
  async getOrders() {
    const result = await this.orderService.getAllOrders();
    return result;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getOneOrder(@Param('id') id: string) {
    const result = await this.orderService.getSingleOrder(id);
    return result;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const result = await this.orderService.deleteSingleOrder(id);
    return result;
  }
}
