import { Controller, Get,UseGuards, Request, Post,Body } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookService } from './book.service';
import { AuthGuardService } from 'src/auth-guard/auth-guard.service';


@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('showBook')
  @UseGuards(AuthGuardService)
  async getAllBook(@Request() req) {
      const bookrRecord= await this.bookService.getBook();
      const user = req.user;
      console.log(user);
      
    return user;
  }

  @Post('insertBook')
  async insertBook(@Body() data:any,@Request() req){
    const user = req.user;
       const insertedBook=await this.bookService.insertBookRecord(data,user);
       return insertedBook;
  }
}


