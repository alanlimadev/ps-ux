import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from './order.entity';

@WebSocketGateway()
export class OrdersGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Server Initialized');
  }

  @SubscribeMessage('createOrder')
  handleOrderCreated(order: Order) {
    this.server.emit('orderCreated', order);
  }

  @SubscribeMessage('updateOrder')
  handleOrderUpdated(order: Order) {
    this.server.emit('orderUpdated', order);
  }

  @SubscribeMessage('deleteOrder')
  handleOrderDeleted(orderId: number) {
    this.server.emit('orderDeleted', orderId);
  }
}
