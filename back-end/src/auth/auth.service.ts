import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { compareHash, encrypt } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from 'src/token';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async logout(user: any) {
    console.log(user);
    return await this.userModel.updateOne(
      { email: user.email },
      { hashedRt: null },
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    const { password: passwordHash } = user;
    if (!compareHash(password, passwordHash)) return null;
    return this.generateTokens(user.email, user.username);
  }

  async refreshToken(rt: string, email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    const { hashedRt } = user;
    if (!compareHash(rt, hashedRt)) return null;
    return this.generateTokens(user.email, user.username);
  }

  async generateTokens(email: string, username: string) {
    const accessToken = this.jwtService.sign(
      { email, username },
      { secret: ACCESS_TOKEN_SECRET, expiresIn: 60 * 15 },
    );
    const refreshToken = this.jwtService.sign(
      { email },
      { secret: REFRESH_TOKEN_SECRET, expiresIn: 60 * 60 * 2 },
    );
    const rtHash = encrypt(refreshToken);
    await this.userModel.updateOne({ email }, { hashedRt: rtHash });
    return { accessToken, refreshToken };
  }
}
