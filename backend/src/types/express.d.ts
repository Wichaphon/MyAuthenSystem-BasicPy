// src/types/express.d.ts
import { JwtPayload } from './jwt-payload'; 

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
