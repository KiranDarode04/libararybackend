import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  // email and password through send the data op= name , email, ragisterd at , book status, book name
  async getStudentDetails(user, data) {
    try {
      const { email, password } = user;
      if (!(user.role === 'STUDENT')) {
        throw new HttpException('Unathorized user', HttpStatus.BAD_REQUEST);
      }

      if (
        Object.keys(email).length === 0 &&
        Object.keys(password).length === 0
      ) {
        throw new HttpException(
          'please enter the name and password',
          HttpStatus.BAD_REQUEST,
        );
      }
      const studentDetails = await this.prismaService.user.findFirst({
        where: { email, password },
        select: { name: true, email: true, createdAt: true, id: true },
      });

      if (!studentDetails) {
        throw new HttpException(
          'student Record not found !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const getBookStatus = await this.prismaService.bookStatus.findFirst({
        where: { studentId: studentDetails.id },
        select: {
          bookId: true,
          status: true,
        },
      });

      if (!getBookStatus) {
        return [{ ...studentDetails, status: 'NA', BookNames: 'NA' }];
      }

      const findBookName = await this.prismaService.book.findFirst({
        where: {
          id: getBookStatus.bookId,
        },
        select: {
          name: true,
        },
      });

      const { name } = findBookName;

      if (getBookStatus.status === 'ISSUE') {
        return [{ ...studentDetails, status: 'Present', BookNames: name }];
      }
      return [{ ...studentDetails, status: 'NA', BookNames: 'NA' }];
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  // book code, name , status=avaible or not avilable
  async getBookList() {
    try {
      const bookCodeAndName = await this.prismaService.book.findMany({
        select: { id: true, name: true, bookCode: true, createdAt: true },
      });

      if (!bookCodeAndName) {
        return new HttpException(
          'Book Record not found !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const availableQuantity = [];
      const getBookDetails = [];
      for (const id in bookCodeAndName) {
        const bookStatus = await this.prismaService.bookStore.findFirst({
          where: { bookId: bookCodeAndName[id].id },
          select: { availableQuantity: true, bookId: true },
        });

        if (bookStatus.availableQuantity > 0) {
          availableQuantity.push({
            bookId: bookStatus.bookId,
            name: bookCodeAndName[id].name,
            BookCode: bookCodeAndName[id].bookCode,
            status: 'avilable Book',
          });
        } else {
          availableQuantity.push({
            bookId: bookStatus.bookId,
            name: bookCodeAndName[id].name,
            BookCode: bookCodeAndName[id].bookCode,
            status: 'not avilable Book',
          });
        }
      }

      return [{ BookDetails: availableQuantity }];
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

 async searchBook(data){
try {
  const {name}=data;
  if((Object.keys(name).length ===0)){
    throw new HttpException("Enter the name", HttpStatus.BAD_REQUEST);
  }
  const book = await this.prismaService.book.findMany({
    where: { name: { contains: name, mode: 'insensitive' } },
    select:{
         id:true,name:true,author:true
    }

  });
  const  availableQuantity=[];
  for (const id in book) {
    const bookStatus = await this.prismaService.bookStore.findFirst({
      where: { bookId: book[id].id },
      select: { availableQuantity: true, bookId: true },
    });

    if (bookStatus.availableQuantity > 0) {
      availableQuantity.push({
        bookId: bookStatus.bookId,
        name: book[id].name,
        status: 'avilable Book',
        author:book[id].author,
        type:"book"
      });
    } else {
      availableQuantity.push({
        bookId: bookStatus.bookId,
        name: book[id].name,
        status: 'Not avilable Book',
        author:book[id].author,
        type:"book"
      });
    }
  }

  return [{searchBook:availableQuantity}];
  
} catch (error) {
  throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
}
 }
}
