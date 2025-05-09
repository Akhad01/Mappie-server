import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUsers(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findUser(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.removeUser(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto:
  UpdateUserDto) {
    return await this.usersService.updateUser(+id, updateUserDto);
  }
}