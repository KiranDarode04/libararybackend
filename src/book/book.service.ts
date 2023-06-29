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
        console.info(user);
        // const u_id=user.
        const { bookCode, name, quantity, author, language } = data;
        if (
          Object.keys(bookCode).length >= 0 &&
          Object.keys(name).length >= 0 &&
          Object.keys(quantity).length >= 0 &&
          Object.keys(author).length >= 0 &&
          Object.keys(language).length >= 0
        ) {
          const bookQtyNumberThrough = await this.prismaService.book.findFirst({
            where: { bookCode: bookCode },
          });
          if (!bookQtyNumberThrough) {
            const insertBook = await this.prismaService.book.create({
              data: { bookCode, author, name, language, quantity },
            });
         const findPrevQty=await this.prismaService.bookI.findFirst({where:{bookCode}});
         const prvQtyNumber= parseInt(findPrevQty.totalQuantity);
         if(prvQtyNumber>0){
          const totalQty=prvQtyNumber+quantity;
          const totalQtyStr=totalQty.toString();
          // const addImportBook= await this.prismaService.bookI.create({data:{bookCode:bookCode,totalQuantity:totalQtyStr}})

         }
            return insertBook;
          } else {
            throw new HttpException(
              'Book is alrady exits',
              HttpStatus.NOT_FOUND,
            );
          }
        } else {
          throw new NotFoundException('please fill the all fild');
        }
      } else {
        throw new UnauthorizedException('Invalid credentials');
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
