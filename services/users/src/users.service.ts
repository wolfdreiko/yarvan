import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  create(userData: any) {
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  findById(id: number) {
    return this.users.find(user => user.id === id);
  }
}