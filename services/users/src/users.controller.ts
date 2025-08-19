import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }
}