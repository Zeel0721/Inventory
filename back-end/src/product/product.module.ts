import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PRODUCT_SERVICE } from 'src/token';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from 'src/schema/product.schema';
import { User, userSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_SERVICE,
      useClass: ProductService,
    },
  ],
})
export class ProductModule {}
