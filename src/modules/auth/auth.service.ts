import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Login } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: Login): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>(process.env.JWT_SECRET),
      },
    );

    return { accessToken };
  }

  async signUp(signupDto: SignUpDto): Promise<{ accessToken: string }> {
    const { name, email, password } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>(process.env.JWT_SECRET),
        expiresIn: this.configService.get<string | number>('JWT_EXPIRES'),
      },
    );

    return { accessToken };
  }
}