import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() orderDto: Partial<Order>): Order {
    return this.ordersService.createOrder(orderDto);
  }

  @Get(':id')
  getOrder(@Param('id') id: string): Order {
    const orderId = parseInt(id, 10); 
    if (isNaN(orderId)) {
      throw new NotFoundException(`Invalid ID: ${id}`);
    }
    return this.ordersService.getOrderById(orderId);
  }

  @Get()
  listOrders(): Order[] {
    return this.ordersService.listOrders();
  }

  @Put(':id')
  updateOrder(
    @Param('id') id: string,
    @Body() updateDto: Partial<Order>,
  ): Order {
    const orderId = parseInt(id, 10); 
    if (isNaN(orderId)) {
      throw new NotFoundException(`Invalid ID: ${id}`);
    }
    return this.ordersService.updateOrder(orderId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOrder(@Param('id') id: string): void {
    const orderId = parseInt(id, 10); 
    if (isNaN(orderId)) {
      throw new NotFoundException(`Invalid ID: ${id}`);
    }
    this.ordersService.deleteOrder(orderId);
  }
}
