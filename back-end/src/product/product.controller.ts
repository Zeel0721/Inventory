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
import { PRODUCT_SERVICE } from '../token';
import { ProductService } from './product.service';
import { CreateProductDto } from '../DTO/create-product.dto';
import { UpdateProductDto } from '../DTO/update-product.dto';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productService: ProductService,
  ) {}

  @Post('create')
  create(@Req() req: Request, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(req.user, createProductDto);
  }

  @Get('findall')
  getAll(@Req() req: Request) {
    return this.productService.getAll(req.user);
  }

  @Get('findone/:id')
  getOne(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

  @Put('updateproducts/:id')
  updateProduct(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(req.user, id, updateProductDto);
  }

  @Delete('deleteall')
  remove() {
    return this.productService.remove();
  }

  @Delete('deleteone/:id')
  deleteone(@Req() req: Request, @Param('id') id: string) {
    return this.productService.deleteone(req.user, id);
  }
}
