import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Request,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  AuthGuardService,
  LocalAuthGuard,
} from 'src/auth-guard/auth-guard.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(AuthGuardService)
  @Get('getStudentDetails') //input email and password
  async getStudentDetails(@Request() req, @Query() data) {
    const user = req.user;
    return await this.studentService.getStudentDetails(user, data);
  }

  // book code,name,status
  @Get('getBookDetails')
  async getBookList() {
    return await this.studentService.getBookList();
  }

  @Get('searchBook')
  async searchBook(@Query() data) {
    return await this.studentService.searchBook(data);
  }
}
