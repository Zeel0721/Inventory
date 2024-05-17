import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ORDER_SERVICE } from 'src/token';
import { OrderService } from './order.service';
import { CreateOrderlistDto } from 'src/DTO/create-orderlist.dto';
import { UpdateOrderlistDto } from 'src/DTO/update-orderlist.dto';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderService: OrderService,
  ) {}

  @Post('create')
  create(@Req() req: Request, @Body() createorderlistDto: CreateOrderlistDto) {
    return this.orderService.create(req.user, createorderlistDto);
  }

  @Get('getall')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('getone/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put('updateorderlist/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateorderlistDto: UpdateOrderlistDto,
  ) {
    return this.orderService.update(id, updateorderlistDto);
  }

  @Delete('deleteall')
  removeAll() {
    return this.orderService.removeAll();
  }

  @Delete('deleteone/:id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
