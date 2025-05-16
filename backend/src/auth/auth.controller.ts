// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { JwtPayload } from '../types/jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const result = await this.authService.validateUser(body.username, body.password);

    if (!result || result.status !== 'success') {
      throw new UnauthorizedException(result?.message || 'Invalid credentials');
    }

    return result; // ✅ { status, token, data: { myname, myposition, picture } }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return {
      myname: user.myname,
      myposition: user.myposition,
      picture: user.picture,
    };
  }
}
