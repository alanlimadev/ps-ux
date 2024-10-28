import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order } from './order.entity';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private idCounter = 1;

  constructor(private readonly ordersGateway: OrdersGateway) {}

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
    this.ordersGateway.handleOrderCreated(newOrder); 
    return newOrder;
  }

  listOrders(): Order[] {
    return this.orders;
  }

  updateOrder(id: number, updateDto: Partial<Order>): Order {
    const order = this.getOrderById(id);
    Object.assign(order, updateDto);
    this.ordersGateway.handleOrderUpdated(order); 
    return order;
  }

  deleteOrder(id: number): void {
    const index = this.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    const deletedOrder = this.orders.splice(index, 1)[0];
    this.ordersGateway.handleOrderDeleted(deletedOrder.id); 
  }

  getOrderById(id: number): Order {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
