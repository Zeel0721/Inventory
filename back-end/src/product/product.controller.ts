import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { PRODUCT_SERVICE } from 'src/token';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/DTO/create-product.dto';
import { UpdateProductDto } from 'src/DTO/update-product.dto';
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
  getAll() {
    return this.productService.getAll();
  }

  @Get('findone/:id')
  getOne(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

  @Put('updateproducts/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('deleteall')
  remove() {
    return this.productService.remove();
  }

  @Delete('deleteone/:id')
  deleteone(@Param('id') id: string) {
    return this.productService.deleteone(id);
  }
}
