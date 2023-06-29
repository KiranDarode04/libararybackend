import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  async insertBookRecord(data: any, user) {
    try {
    
     console.info(user.role);
      if (user.role == 'ADMIN' || user.role == 'LIBRARIAN') {
        const u_id = user.id;
        console.info(u_id);
        const { bookCode, name, quantity, author, language } = data;
        if (
          Object.keys(bookCode).length >= 0 &&
          Object.keys(name).length >= 0 &&
          Object.keys(quantity).length >= 0 &&
          Object.keys(author).length >= 0 &&
          Object.keys(language).length >= 0
        ) {
          console.info("ddwe");
          const findBookCode = await this.prismaService.book.findFirst({
            where: { bookCode },
          });
          console.info(findBookCode);
        
        }
        else {
          console.info('else');
        }
      } 
    } catch (error) {
      return error;
    }
  }

  async getBook() {
    try {
      const getBook = await this.prismaService.book.findMany({});
      if (!getBook) {
        throw new NotFoundException('record is empty');
      } else {
        return getBook;
      }
    } catch (error) {}
  }
}
