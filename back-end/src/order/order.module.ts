import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ORDER_SERVICE } from 'src/token';
import { MongooseModule } from '@nestjs/mongoose';
import { Orderlist, orderlistSchema } from 'src/schema/order.schema';
import { User, userSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orderlist.name, schema: orderlistSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_SERVICE,
      useClass: OrderService,
    },
  ],
})
export class OrderModule {}
