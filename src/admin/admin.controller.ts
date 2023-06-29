import { Body, Controller, Delete, Get,Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

  constructor(private readonly adminService: AdminService) {}


  @Delete('deleteData')
  async test(@Body() data:any) {
    return await this.adminService.deleteUserData();
  }


}
