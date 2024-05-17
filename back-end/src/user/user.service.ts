import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, SaveOptions } from 'mongoose';
import { UserDto } from 'src/DTO/user.dto';
import { encrypt } from 'src/auth/utils/bcrypt';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUser: UserDto) {
    try {
      const userData = {
        ...createUser,
        password: encrypt(createUser.password),
      };
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      if (error.code)
        throw new BadRequestException('A user with this email already exists');
      else throw new BadRequestException(error);
    }
  }
}
