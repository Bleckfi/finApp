import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new BadRequestException('Email already taken');

    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hash, fullName },
    });

    // Генерируем токен
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    return { token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      userName: user.fullName,
    });
    return { token };
  }
}
