import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDto } from 'src/DTO/user.dto';

@Schema({ timestamps: true })
export class Orderlist {
  @Prop()
  companyname: string;

  @Prop([String])
  productname: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: UserDto;
}

export const orderlistSchema = SchemaFactory.createForClass(Orderlist);
