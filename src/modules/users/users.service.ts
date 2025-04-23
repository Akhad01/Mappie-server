import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UsersModule } from './users.module';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async createUsers(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user.save();
  }

  async findAllUsers() {
    const users = this.userModel.find();
    return users;
  }

  async findUser(id: number) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('could not find the user');
    return user;
  }

  removeUser(id: number) {
    return this.userModel.findByIdAndDelete(id);
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true
  });

  }

;
}