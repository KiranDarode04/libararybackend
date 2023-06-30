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
      if (user.role == 'ADMIN' || user.role == 'LIBRARIAN') {
        const u_id = user.id;
        const { bookCode, name, quantity, author, language } = data;
        if (
          Object.keys(bookCode).length >= 0 &&
          Object.keys(name).length >= 0 &&
          Object.keys(quantity).length >= 0 &&
          Object.keys(author).length >= 0 &&
          Object.keys(language).length >= 0
        ) {
          const findBookCode = await this.prismaService.book.findFirst({
            where: { bookCode }
          });
         if(!findBookCode){
          const insertBook=await this.prismaService.book.create({data:{bookCode,author,language,name,quantity}});
          const insertBookImportData=await this.prismaService.bookI.create({data:{totalQuantity:quantity,bookCode,user_id:u_id}});
          const insertBookStoreData=await this.prismaService.bookStore.create({data:{bookCode,totalQuantity:quantity,issueQuantity:0}})
          console.info("findBookCode");
          return {Book:insertBook,BookI:insertBookImportData,BookStore:insertBookStoreData}
         }
        
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
