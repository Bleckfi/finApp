// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
    });
  }

  async validate(payload: any) {
    // Возвращаем данные пользователя, которые будут доступны в req.user
    return {
      id: payload.sub,
      email: payload.email,
      userName: payload.userName,
    };
  }
}
