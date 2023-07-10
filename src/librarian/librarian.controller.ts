import { Controller } from '@nestjs/common';
import { LibrarianService } from './librarian.service';
import {
  AuthGuardService,
  LocalAuthGuard,
} from 'src/auth-guard/auth-guard.service';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller('librarian')
export class LibrarianController {
  constructor(private readonly librarianService: LibrarianService) {}

  @Get('test')
  @UseGuards(AuthGuardService)
  async test() {
    return 'ok';
  }

  @Get('getLibrarianDashBordData')
  @UseGuards(AuthGuardService)
  async getlibrarianDashbordData(@Request() req) {
    const user = req.user;
    return await this.librarianService.getlibrarianDashbordData(user);
  }

  @Post('registerStudent')
  @UseGuards(AuthGuardService)
  async registerStudent(@Request() req, @Body() data: any) {
    const user = req.user;
    return await this.librarianService.registerStudent(user, data);
  }

  @Get('getBookList')
  @UseGuards(AuthGuardService)
  async getBookList(@Request() req, @Query() page) {
    const user = req.user;
    return await this.librarianService.getBookList(user, page);
  }

  @Get('searchBookAndStudent')
  @UseGuards(AuthGuardService)
  async searchBookAndStudent(@Request() req, @Query() data) {
    const user = req.user;
    return await this.librarianService.searchBookAndStudentService(user, data);
  }

  //pagination
  @Get('searchMoreBookAndStudent')
  @UseGuards(AuthGuardService)
  async searchMoreBookAndStudent(@Request() req, @Query() data) {
    const user = req.user;
    return await this.librarianService.searchMoreBookAndStudentService(
      user,
      data,
    );
  }
}
