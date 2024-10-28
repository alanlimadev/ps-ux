import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private idCounter = 1;

  createOrder(orderDto: Partial<Order>): Order {
    if (!orderDto.name) {
      throw new BadRequestException('The "name" field is required.');
    }

    const newOrder: Order = {
      id: this.idCounter++,
      name: orderDto.name,
      products: orderDto.products || [],
      address: orderDto.address || '',
      status: 'Pendente',
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  getOrderById(id: number): Order {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  listOrders(): Order[] {
    return this.orders;
  }

  updateOrder(id: number, updateDto: Partial<Order>): Order {
    const order = this.getOrderById(id);
    Object.assign(order, updateDto);
    return order;
  }

  deleteOrder(id: number): void {
    const index = this.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    this.orders.splice(index, 1);
  }
}
