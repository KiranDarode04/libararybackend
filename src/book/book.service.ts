import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'http';
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
            where: { bookCode },
          });
          if (!findBookCode) {
            const insertBook = await this.prismaService.book.create({
              data: { bookCode, author, language, name, quantity },
            });
            const insertBookImportData = await this.prismaService.bookI.create({
              data: { totalQuantity: quantity, bookCode, user_id: u_id },
            });
            const insertBookStoreData =
              await this.prismaService.bookStore.create({
                data: { bookCode, totalQuantity: quantity, issueQuantity: 0 },
              });
            return {
              Book: insertBook,
              BookI: insertBookImportData,
              BookStore: insertBookStoreData,
            };
          } else {
            throw new HttpException(
              'book is exits please insert the Book Quantity',
              HttpStatus.PARTIAL_CONTENT,
            );
          }
        } else {
          throw new HttpException(
            'please fill the all data',
            HttpStatus.PARTIAL_CONTENT,
          );
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

  async updateBookQty(data: any, user: any) {
    try {
      if (user.role == 'ADMIN' || user.role == 'LIBRARIAN') {
        const { bookCode, quantity } = data;
        const bookQtyUpdate = await this.prismaService.book.update({
          where: { bookCode },
          data: { quantity: quantity },
        });

        const findbook = await this.prismaService.bookI.findFirst({
          where: { bookCode },
        });
        if (findbook) {
          const bookId = findbook.id;
          const updateImportBookQty = await this.prismaService.bookI.update({
            where: { id: bookId },
            data: { totalQuantity: quantity },
          });
        } else {
          throw new HttpException(
            'Book import track not found book',
            HttpStatus.METHOD_NOT_ALLOWED,
          );
        }
        const updateBookStore = await this.prismaService.bookStore.update({
          where: { bookCode },
          data: { totalQuantity: quantity },
        });
        return HttpStatus.OK;
      }
    } catch (error) {}
  }
  async issuseBookStudent(data: any, user: any) {
    try {
      if (user.role == 'LIBRARIAN') {
        const u_id = user.id;
        const { studentId, bookId } = data;
        const findStudent = await this.prismaService.user.findFirst({
          where: { id: studentId },
        });

        if (findStudent.role != 'STUDENT') {
          return new HttpException(
            'student Id is not valid',
            HttpStatus.NOT_FOUND,
          );
        }
        const BookDetailsFind = await this.prismaService.book.findFirst({
          where: {
            id: bookId,
          },
        });
        if (!BookDetailsFind) {
          return new HttpException('book not found', HttpStatus.NOT_FOUND);
        }

        const findBook = await this.prismaService.bookStore.findFirst({
          where: {
            bookCode: BookDetailsFind.bookCode,
          },
        });

        if (findBook) {
          if (findBook.totalQuantity > findBook.issueQuantity) {
            const bookIssue = await this.prismaService.bookIR.create({
              data: { bookId, user_id: u_id, studentId },
            });

            const bookStoreBookData =
              await this.prismaService.bookStore.findFirst({
                where: { bookCode: BookDetailsFind.bookCode },
              });

            if (bookStoreBookData) {
              const { bookCode, totalQuantity, issueQuantity } =
                bookStoreBookData;
              const updatedQty = issueQuantity + 1;
              const bookQtyUpdate = await this.prismaService.bookStore.update({
                where: {
                  bookCode,
                },
                data: {
                  issueQuantity: updatedQty,
                },
              });
              return HttpStatus.OK;
            }
          } else {
            throw new HttpException(
              'Book not avilable, All Book issued',
              HttpStatus.NOT_FOUND,
            );
          }
        } else {
          throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      return error;
    }
  }

  async searchBook(data: any, user) {
    try {
      if (Object.keys(data.name).length > 0) {
        const searchBook = await this.prismaService.book.findMany({
          where: {
            name: {
              contains: data.name,
              mode: 'default',
            },
          },
        });
        return searchBook;
      }
    } catch (error) {}
  }

  async returnBook(data, user) {
    try {
      if (user.role == 'LIBRARIAN') {
        if (Object.keys(data.name).length > 0) {
          const { email,name } = data;
          const findStudent = await this.prismaService.user.findFirst({
            where: { email },
          });
          // delete the BookIR record table -> i/p book name and student email-> email through find student id and delete
           if(findStudent.role==="STUDENT"){
               const studentId=findStudent.id;
               const issuedStuedentDetails= await this.prismaService.bookIR.findFirst({where:{studentId}});
               if(!issuedStuedentDetails) return 0;

           }

          // book store table decrese the issueBook record
        } else {
          return new HttpException('fill the email', HttpStatus.NOT_ACCEPTABLE);
        }
      } else {
        return new HttpException('user not valid', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      return error;
    }
  }

  async getBookIssue(data, user) {
    try {
      console.info(user.role);
      if (user.role === 'LIBRARIAN') {
        const issueBookDetails = await this.prismaService.bookIR.findMany({});
        return issueBookDetails;
      } else {
        return new HttpException('user not valid', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      return error;
    }
  }
}
