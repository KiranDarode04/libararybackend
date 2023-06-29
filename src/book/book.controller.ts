import { Controller, Get,UseGuards, Request, Post,Body } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookService } from './book.service';
import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('showBook')
  @UseGuards(JwtAuthGuard)
  async getAllBook(@Request() req) {
      const bookrRecord= await this.bookService.getBook();
      const user = req.user;
      console.info("user :"+user.name);
    return user;
  }

  @Post('insertBook')
  @UseGuards(JwtAuthGuard)
  async insertBook(@Body() data:any,@Request() req){
    const user = req.user;
       const insertedBook=await this.bookService.insertBookRecord(data,user);
       return insertedBook;
  }
}


