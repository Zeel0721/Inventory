import { Body, Controller, Inject, Post } from '@nestjs/common';
import { USER_SERVICE } from 'src/token';
import { UserService } from './user.service';
import { UserDto } from 'src/DTO/user.dto';
import { Public } from 'src/utils/public.decorator';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  @Public()
  @Post('signup')
  createUser(@Body() createUser: UserDto) {
    return this.userService.createUser(createUser);
  }
}
