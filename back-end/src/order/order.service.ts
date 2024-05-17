import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderlistDto } from 'src/DTO/create-orderlist.dto';
import { UpdateOrderlistDto } from 'src/DTO/update-orderlist.dto';
import { populateOption } from 'src/product/product.service';
import { Orderlist } from 'src/schema/order.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orderlist.name) private orderListModel: Model<Orderlist>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(
    user: any,
    createorderlistDto: CreateOrderlistDto,
  ): Promise<Orderlist[]> {
    try {
      const userId = await this.userModel.findOne({ email: user.email });
      const createdOrderlist = new this.orderListModel({
        ...createorderlistDto,
        createdBy: userId._id,
      });
      if (!createdOrderlist) {
        throw new HttpException(' products Not created', HttpStatus.NOT_FOUND);
      }
      await createdOrderlist.save();
      return await this.orderListModel.find().populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Orderlist[]> {
    try {
      return await this.orderListModel.find().populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error getting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Orderlist> {
    try {
      return await this.orderListModel.findById(id).populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error getting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateorderlistDto: UpdateOrderlistDto,
  ): Promise<Orderlist[]> {
    try {
      const existingorderlist = await this.orderListModel
        .findByIdAndUpdate(id)
        .exec();
      if (!existingorderlist) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(existingorderlist, updateorderlistDto);
      await existingorderlist.save();
      return await this.orderListModel.find().populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error updating product ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeAll() {
    try {
      await this.orderListModel.deleteMany().exec();
      return 'All order details has been deleted';
    } catch (error) {
      throw new HttpException(
        'Error deleting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Orderlist[]> {
    try {
      await this.orderListModel.findByIdAndDelete(id).exec();
      return await this.orderListModel.find().populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error deleting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
