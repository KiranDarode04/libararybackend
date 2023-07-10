import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,UseGuards
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuardService, LocalAuthGuard,} from 'src/auth-guard/auth-guard.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Delete('deleteAllData')
  async deleteAllData(@Body() data: any) {
    return await this.adminService.deleteAllData();
  }

  //one time regiter user
  @Post('registerAdmin')
  async registerAdmin(@Body() data: any) {
    return await this.adminService.registerAdmin(data);
  }

  //dashbord Api
  @Get('countTotal')
  async countTotalBook() {
    return await this.adminService.countTotal();
  }

  @Get('searchStudentLibrarianOrBook')
  async searchStudentLibrarianOrBook(@Query() data) {
    return await this.adminService.searchStudentLibrarianAndBook(data);
  }

  //no limit
  @Get('searchMoreStudentLibrarianOrBook')
  async searchMoreStudentLibrarianOrBook(@Query() query) {
    return await this.adminService.searchMoreStudentLibrarianAndBook(query);
  }

  //on clicked searched data  then showing the data stundent, librarian, book
  @Get('onClickedsearchedValue')
  async onClickedSearchedData(@Query() data: any) {
    return await this.adminService.onClickedSearchedData(data);
  }
  @Get('getUserDetails')
  async getUserDetails(@Query() userId) {
    return await this.adminService.getUserDetails(userId);
  }
  //881058160653650
  //bookCode
  @Get('checkBookExitsOrNot')
  async checkBookExitsOrNot(@Query() bookId) {
    return await this.adminService.checkBookIsExitsOrNot(bookId);
  }

  @Post("insertBook")
  @UseGuards(AuthGuardService)
 async importNewBook(@Body() data:any,@Request() req){
  const user = req.user;
   return await this.adminService.insertNewBook(data, user);
  }
  
  @Post("importBook")
  @UseGuards(AuthGuardService)
 async insertNewBook(@Body() data:any,@Request() req){
  const user = req.user;
   return await this.adminService.importBook(data, user);
  }

  //inlude pagination
  @Get("getBookImportedBookHistory")
  @UseGuards(AuthGuardService)
  async getBookImportedBookHistory(@Request() req,@Query() page){
    const user = req.user;
    return await this.adminService.getBookImportedBookHistory(user,page);
  }
  @Get("getlibrarianHistory")
  @UseGuards(AuthGuardService)
  async getLibrarianHistory(@Request() req,@Query() page){
    const user = req.user;
    return await this.adminService.getLibrarianHistory(user,page);
  }

  @Post("createNewLibrarian")
  @UseGuards(AuthGuardService)
  async createNewLibrarian( @Request() req,@Body() data:any){
    const user = req.user;
    return await this.adminService.createNewLibrarian(data,user);
  }

}

//@Request() req
