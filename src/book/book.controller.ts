import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookService } from './book.service';
import { AuthGuardService } from 'src/auth-guard/auth-guard.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('showBook')
  @UseGuards(AuthGuardService)
  async getAllBook(@Request() req) {
    const bookrRecord = await this.bookService.getBook();
    const user = req.user;
    return bookrRecord;
  }

  @Post('insertBook')
  @UseGuards(AuthGuardService)
  async insertBook(@Body() data: any, @Request() req) {
    const user = req.user;
    const insertedBook = await this.bookService.insertBookRecord(data, user);
    return insertedBook;
  }

  @Put('importBook')
  @UseGuards(AuthGuardService)
  async importBook(@Body() data: any, @Request() req) {
    const user = req.user;
    return await this.bookService.importBook(data, user);
    
  }

  @Put('updateImportBookQty')
  @UseGuards(AuthGuardService)
  async updateBookQty(@Body() data: any, @Request() req) {
    const user = req.user;
    const updateBookQty = await this.bookService.updateBookQty(data, user);
    return updateBookQty;
  }

  @Post('issueStudentBook')
  @UseGuards(AuthGuardService)
  async issueStudnetBook(@Body() data: any, @Request() req) {
    const user = req.user;
    const issueBook = await this.bookService.issuseBookStudent(data, user);
    return issueBook;
  }

  @Post('returnBook')
  @UseGuards(AuthGuardService)
  async returnBook(@Body() data: any, @Request() req){
    const user = req.user;
    const returnBook=await this.bookService.returnBook(data,user);
  }

  @Get('searchBook')
  @UseGuards(AuthGuardService)
  async searchBook(@Body() data: any, @Request() req) {
    const user = req.user;
    const searchBook = await this.bookService.searchBook(data, user);
    return searchBook;
  }

  @Get ("getBookIssueList")
  @UseGuards(AuthGuardService)
  async getBookIssueList(@Body() data: any, @Request() req){
    const user = req.user;
    const getIssueBook= await this.bookService.getBookIssue(data,user);
    return getIssueBook;
  }

}
