import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { convertImageUrlToBase64 } from '../utils/image.util';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles('admin')
  async getDashboard() {
    const users = await this.adminService.getAllUsers();
    const usersWithBase64 = await Promise.all(
      users.map(async user => ({
        ...user,
        picture: user.picture ? await convertImageUrlToBase64(user.picture) : null,
      }))
    );

    return {
      message: 'Welcome to the Admin Dashboard',
      users: usersWithBase64,
    };
  }

  @Delete('user/:id')
  @Roles('admin')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('search')
  @Roles('admin')
  async searchUsers(@Query('keyword') keyword: string) {
    const users = await this.adminService.searchUsers(keyword);
    const usersWithBase64 = await Promise.all(
      users.map(async user => ({
        ...user,
        picture: user.picture ? await convertImageUrlToBase64(user.picture) : null,
      }))
    );

    return {
      message: `Search result for: "${keyword}"`,
      users: usersWithBase64,
    };
  }

  @Put('user/:id')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('picture'))
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.adminService.editUser(id, body, file);
  }
}
