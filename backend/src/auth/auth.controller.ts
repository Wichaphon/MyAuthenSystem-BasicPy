import {
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { JwtPayload } from '../types/jwt-payload';
import { validateImageFile } from '../utils/file-validator.util'; 
import { convertImageUrlToBase64 } from '../utils/image.util'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req: Request) {
    const { username, password } = req.body;
    const result = await this.authService.validateUser(username, password);
    if (!result || result.status !== 'success') {
      throw new UnauthorizedException(result?.message || 'Invalid credentials');
    }
    return result;
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('picture'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    validateImageFile(file); 
    const dto = req.body;
    return this.authService.register(dto, file);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as JwtPayload;

    const base64Image = await convertImageUrlToBase64(user.picture);

    return {
      myname: user.myname,
      myposition: user.myposition,
      picture: base64Image, //ส่งbase64 แทน URL
      role: user.role,
      address: user.address,
    };
  }
}
