import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  private users = new Map(); // In-memory store for demo

  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = { id: Date.now(), email: dto.email, password: hashedPassword, role: dto.role };
    this.users.set(dto.email, user);
    
    const { password, ...result } = user;
    return { user: result, token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }) };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.get(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return { user, token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }) };
  }
}