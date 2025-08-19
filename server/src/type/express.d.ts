// types/express.d.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    userName: string;
  };
}
