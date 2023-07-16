import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class LibrarianService {
  constructor(private readonly prismaService: PrismaService) {}

  async getlibrarianDashbordData(user) {
    try {
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('Unathorized user', HttpStatus.BAD_REQUEST);
      }
      let totalBook = 0;
      let totalAvailableBook = 0;
      let totalIssuedBook = 0;

      const countTotalBook = await this.prismaService.bookStore.findMany();
      const countTotalIssuedBook =
        await this.prismaService.bookStore.findMany();
      const countTotalAvailableBook =
        await this.prismaService.bookStore.findMany();
      const countLibrarian = await this.prismaService.user.findMany();
      for (const row of countTotalBook) {
        totalBook += row.totalQuantity;
      }
      for (const row of countTotalIssuedBook) {
        totalIssuedBook += row.issueQuantity;
      }
      for (const row of countTotalAvailableBook) {
        totalAvailableBook += row.availableQuantity;
      }

      return {
        totalBook: totalBook,
        totalIssuedBook,
        totalAvailableBook,
      };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async registerStudent(user, data) {
    try {
      const { name, email, password } = data;
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('Invalid User!', HttpStatus.BAD_REQUEST);
      }
      if (
        !(
          Object.keys(password).length > 0 &&
          Object.keys(email).length > 0 &&
          Object.keys(name).length >= 0
        )
      ) {
        throw new HttpException(
          'all fild is required!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const checkEmailisExitsOrNot = await this.prismaService.user.findFirst({
        where: { role: 'STUDENT', email },
      });
      if (checkEmailisExitsOrNot) {
        throw new HttpException(
          `username is alredy exits plese change the username ${email} `,
          HttpStatus.BAD_REQUEST,
        );
      }
      const createLirarian = await this.prismaService.user.create({
        data: { name, email, password, role: 'STUDENT' },
      });
      if (!createLirarian) {
        throw new HttpException(
          'student can not registerd please check agin',
          HttpStatus.BAD_REQUEST,
        );
      }
      return 'student registerd Successfully';
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  //bookList with pagination
  async getBookList(user, page) {
    try {
      const { limit, offset } = page;
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('Invalid User!', HttpStatus.BAD_REQUEST);
      }

      if (!(limit && offset)) {
        throw new HttpException(
          'please check the pagination data',
          HttpStatus.BAD_REQUEST,
        );
      }

      const bookDetails = await this.prismaService.book.findMany({
        take: parseInt(limit),
        skip: parseInt(offset),
      });
      const book = [];
      for (const row in bookDetails) {
        const bookData = bookDetails[row];
        const findQuantity = await this.prismaService.bookStore.findFirst({
          where: { bookId: bookData.id },
        });
        const importedQuantity = findQuantity.totalQuantity;

        const { name, bookCode, author, createdAt } = bookData;
        book.push({
          name,
          bookCode,
          author,
          Date: createdAt,
          TotalBook: findQuantity.totalQuantity,
          availableQuantity: findQuantity.availableQuantity,
          issuedBook: findQuantity.issueQuantity,
        });
      }
      if (!bookDetails) {
        throw new HttpException(
          'book detail not Found',
          HttpStatus.BAD_REQUEST,
        );
      }
      return book;
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  //searchApi
  //Book and Student search
  async searchBookAndStudentService(user, data) {
    const { name } = data;
    const count = 6;

    try {
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('INVALID USER', HttpStatus.UNAUTHORIZED);
      }
      if (Object.keys(name).length <= 0) {
        throw new HttpException(
          'name not present, please enter the name',
          HttpStatus.BAD_REQUEST,
        );
      }

      const student = await this.prismaService.user.findMany({
        where: {
          role: 'STUDENT',
          name: { contains: name, mode: 'insensitive' },
        },
        take: count,
      });

      if (count == student.length) {
        return { student };
      }

      const book = await this.prismaService.book.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
        take: count - student.length,
      });

      return { student, book };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  // pagination api
  //acc- librarian
  //show all  search
  //pageSize =10
  //table 2
  // table name=1)book 2) student
  // priority 1)book 2)student
  //
  //
  async searchMoreBookAndStudentService(user, data) {
    try {
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('INVALID USER', HttpStatus.UNAUTHORIZED);
      }
      const { name, page, pageSize } = data;

      if (!name) {
        throw new HttpException(
          'name not present, please enter the name',
          HttpStatus.BAD_REQUEST,
        );
      }

      //Pagesize=2
      //page=0

      const studnetCounter = await this.prismaService.user.count({
        where: {
          role: 'STUDENT',
          name: { contains: name, mode: 'insensitive' },
        },
      });

      const student = await this.prismaService.user.findMany({
        where: {
          role: 'STUDENT',
          name: { contains: name, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
        take: parseInt(pageSize),
        skip: parseInt(page) * parseInt(pageSize),
        orderBy: {
          createdAt: 'asc',
        },
      });
      //
      return student;
      const bookCount = await this.prismaService.book.count({
        where: {
          name: { contains: name, mode: 'insensitive' },
        },
      });

      const book = await this.prismaService.book.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const bookList = book.map(({ id, name }) => {
        return {
          id,
          name,
          role: 'Book',
        };
      });
      if (!(student && book)) {
        throw new HttpException('Record not found !', HttpStatus.BAD_REQUEST);
      }

      return {
        totalCounter: bookCount + studnetCounter,
        data: [...student, ...bookList],
      };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  //book name , author, avilable book, issued book,total book
  async getBookDetail(user, data) {
    try {
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('INVALID USER', HttpStatus.UNAUTHORIZED);
      }

      const { id } = data;
      if (!id) {
        throw new HttpException(
          'Id not found, please enter the id',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!(id.length === 24)) {
        throw new HttpException('Id not right', HttpStatus.BAD_REQUEST);
      }
      const findBookId = await this.prismaService.book.findUnique({
        where: { id },
      });
      if (!findBookId) {
        throw new HttpException('Book not found !', HttpStatus.BAD_REQUEST);
      }
      const getBookDetail = await this.prismaService.book.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          author: true,
        },
      });

      const getBookCountDetails = await this.prismaService.bookStore.findFirst({
        where: { bookId: id },
        select: {
          availableQuantity: true,
          totalQuantity: true,
          issueQuantity: true,
        },
      });

      if (!getBookCountDetails) {
        throw new HttpException(
          'Book count  not found !',
          HttpStatus.BAD_REQUEST,
        );
      }

      return [{ ...getBookDetail, ...getBookCountDetails }];
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  //name, email,RegisterdAt,issuedBook
  async getStudentDetail(user, data) {
    try {
      if (!(user.role === 'LIBRARIAN')) {
        throw new HttpException('INVALID USER', HttpStatus.UNAUTHORIZED);
      }

      const { id } = data;
      if (!id) {
        throw new HttpException(
          'Id not found, please enter the id',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!(id.length === 24)) {
        throw new HttpException('Id not right', HttpStatus.BAD_REQUEST);
      }

      const findStudentId = await this.prismaService.user.findFirst({
        where: { id, role: 'STUDENT' },
      });

      if (!findStudentId) {
        throw new HttpException(
          'student Record not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const findStudent = await this.prismaService.user.findFirst({
        where: { id },
        select: { id: true, name: true, createdAt: true },
      });

      const checkBookIssuedOrNot =
        await this.prismaService.bookStatus.findFirst({
          where: { studentId: id },
        });

      if (!checkBookIssuedOrNot) {
        return [{ ...findStudent, IssuedBook: 'NA' }];
      }
      if (checkBookIssuedOrNot.status === 'RETURN') {
        return [{ ...findStudent, IssuedBook: 'Issued' }];
      }
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  
}
