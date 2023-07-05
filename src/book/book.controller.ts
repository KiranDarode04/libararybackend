import { Controller, Get,UseGuards, Request, Post, Body,Put,} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookService } from './book.service';
import { AuthGuardService } from 'src/auth-guard/auth-guard.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  
}
