import { Body, Controller, Delete, Get,Param,Post,Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuardService,LocalAuthGuard } from 'src/auth-guard/auth-guard.service';

@Controller('admin')
export class AdminController {

  constructor(private readonly adminService: AdminService) {}
  @Delete('deleteAllData')
  async deleteAllData(@Body() data:any) {
    return await this.adminService.deleteAllData();
  }

  //one time regiter user
  @Post('registerAdmin')
  async registerAdmin(@Body() data: any){
   return await this.adminService.registerAdmin(data);
  }

  @Get('countTotal')
  async countTotalBook(){
    return await this.adminService.countTotal();
  }

  @Get('searchStudentLibrarianOrBook')
  async searchStudentLibrarianOrBook(@Query() data){
    return await this.adminService.searchStudentLibrarianAndBook(data);
  }

  //no limit
  @Get('searchMoreStudentLibrarianOrBook')
  async searchMoreStudentLibrarianOrBook(@Query() query){
    return await this.adminService.searchMoreStudentLibrarianAndBook(query);
  }
 

  @Get('getLibrarianDetails')
  async getLibrarianDetails(@Query() librarainId){
    return  await this.adminService.getLibrarianDetails(librarainId);
  }
  @Get('getStudentDetails')
  async getStudentDetails(@Query() studentId){
    return  await this.adminService.getStudentDetails(studentId);
  }

}
//@Request() req