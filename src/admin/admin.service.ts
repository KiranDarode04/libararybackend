import {
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { inspect } from 'util';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteAllData() {
    await this.prismaService.bookImport.deleteMany({});
    await this.prismaService.bookIR.deleteMany({});
    await this.prismaService.bookStore.deleteMany({});
    await this.prismaService.book.deleteMany({});

    return 'deleted all';
  }

  async registerAdmin(data) {
    try {
      const { name, email, password, role } = data;
      if (
        !(
          Object.keys(name).length > 0 &&
          Object.keys(email).length > 0 &&
          Object.keys(password).length > 0
        )
      ) {
        throw new HttpException(
          'please fill the all data !',
          HttpStatus.BAD_REQUEST,
        );
      }
      const findAdmin = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });

      if (findAdmin) {
        throw new HttpException(
          'username is alrady exits !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const registerAdmin = await this.prismaService.user.create({
        data: {
          email,
          name,
          password,
          role: 'ADMIN',
        },
      });

      return { msg: 'Admin register successfully' };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async countTotal() {
    try {
      let totalBook = 0;
      let totalAvailableBook = 0;
      let totalIssuedBook = 0;
      let totalLibrarian = 0;

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
      for (const row of countLibrarian) {
        if (row.role === 'LIBRARIAN') {
          totalLibrarian++;
        }
      }
      return {
        totalBook: totalBook,
        totalIssuedBook,
        totalAvailableBook,
        totalLibrarian,
      };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async searchStudentLibrarianAndBook(data) {
    const { name } = data;
    const count = 6;

    try {
      
      if (Object.keys(name).length <= 0) {
        throw new HttpException(
          'name not present, please enter the name',
          HttpStatus.BAD_REQUEST,
        );
      }
      const librarian = await this.prismaService.user.findMany({
        where: {
          role: 'LIBRARIAN',
          name: { contains: name, mode: 'insensitive' },
        },
        take: count,
      }); 

      if (count <= librarian.length) {
        return librarian;
      }

      const student = await this.prismaService.user.findMany({
        where: {
          role: 'STUDENT',
          name: { contains: name, mode: 'insensitive' },
        },
        take: count - librarian.length,
      });

      if (count == librarian.length + student.length) {
        return { librarian, student };
      }

      const book = await this.prismaService.book.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
        take: count - (librarian.length + student.length),
      });

      let flag = false;

      if (librarian.length + student.length + book.length >= count) {
        flag = true;
      }

      const sanitizedData = [...librarian, ...student, ...book];
      if (flag) {
        sanitizedData.pop();
      }

      return {
        showMore: flag,
        data: [...librarian, ...student, ...book],
      };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async searchMoreStudentLibrarianAndBook(query) {
    try {
      if (!query) {
        throw new HttpException(
          'name not present, please enter the name',
          HttpStatus.BAD_REQUEST,
        );
      }
      const librarian = await this.prismaService.user.findMany({
        where: {
          role: 'LIBRARIAN',
          name: { contains: query.query, mode: 'insensitive' },
        },
      });

      const student = await this.prismaService.user.findMany({
        where: {
          role: 'STUDENT',
          name: { contains: query.query, mode: 'insensitive' },
        },
      });

      const book = await this.prismaService.book.findMany({
        where: {
          name: { contains: query.query, mode: 'insensitive' },
        },
      });

      if (!(librarian && student && book)) {
        throw new HttpException('Record not found !', HttpStatus.BAD_REQUEST);
      }

      return { librarian, student, book };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  //identify the id librariran,student or book
  async onClickedSearchedData(data) {
    try {
      const { id } = data;
      console.info(Object.keys(id).length);
      if (!id) {
        throw new HttpException(
          'id not present, please enter the id',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!(Object.keys(id).length == 24)) {
        throw new HttpException(
          'id not valid, please enter the id',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findLibrarian = await this.prismaService.user.findFirst({
        where: { id: id, role: 'LIBRARIAN' },
      });
      const findStudent = await this.prismaService.user.findFirst({
        where: { id: id, role: 'STUDENT' },
      });
      const findBook = await this.prismaService.book.findFirst({
        where: { id: id },
      });

      if (findLibrarian) {
        return findLibrarian;
      } else if (findStudent) {
        return findStudent;
      } else if (findBook) {
        return findBook;
      } else {
        throw new HttpException(
          'enterd id record not found, please enter the right id',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async getUserDetails(data) {
    try {
      const { userId } = data;
      if (!userId) {
        throw new HttpException('Enter the user id !', HttpStatus.BAD_REQUEST);
      }
      if (!(Object.keys(userId).length == 24)) {
        throw new HttpException(
          'id not valid, please enter the id',
          HttpStatus.BAD_REQUEST,
        );
      }
      const getUserDetails = await this.prismaService.user.findFirst({
        where: {
          id: userId,
          role: 'ADMIN',
        },
      });
      if (!getUserDetails) {
        throw new HttpException(
          'user not valid, please enter the id',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { name, email, createdAt } = getUserDetails;
      return { name, email, createdAt };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  async checkBookIsExitsOrNot(bookId) {
    try {
      const { bookCode } = bookId;
      if (!bookCode) {
        throw new HttpException('Enter the book id !', HttpStatus.BAD_REQUEST);
      }

      const findBook = await this.prismaService.book.findFirst({
        where: { bookCode },
      });
      if (!findBook) {
        throw new HttpException('Book not exits !', HttpStatus.BAD_REQUEST);
      }
      return findBook;
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  // entry first- book,
  async insertNewBook(data, user) {
    try {
      if (!(user.role === 'ADMIN')) {
        throw new HttpException(' User Not Valid!', HttpStatus.UNAUTHORIZED);
      }
      const { bookCode, name, author, bookQuantity } = data;

      if (!bookCode) {
        throw new HttpException('Enter the book id !', HttpStatus.BAD_REQUEST);
      }
      const findBook = await this.prismaService.book.findFirst({
        where: { bookCode },
      });
      if (findBook) {
        throw new HttpException(
          'Book is alrady exits !',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        !(
          Object.keys(name).length > 0 &&
          Object.keys(author).length > 0 &&
          Object.keys(bookQuantity).length >= 0
        )
      ) {
        throw new HttpException(
          'All fild is mandatory !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findBookName = await this.prismaService.book.findFirst({
        where: { name },
      });
      if (findBookName) {
        throw new HttpException(
          'book name is alrady exits !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const insertBook = await this.prismaService.book.create({
        data: { name, bookCode, author },
      });
      if (!insertBook) {
        throw new HttpException(
          'book no insterted please try agin !',
          HttpStatus.BAD_REQUEST,
        );
      }
      const addBookSInBookStore = await this.prismaService.bookStore.create({
        data: {
          bookId: insertBook.id,
          availableQuantity: bookQuantity,
          totalQuantity: bookQuantity,
          issueQuantity: 0,
        },
      });

      if (!addBookSInBookStore) {
        throw new HttpException(
          'book not added book Store please try agin !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const bookImport = await this.prismaService.bookImport.create({
        data: {
          bookId: insertBook.id,
          Quantity: bookQuantity,
          user_id: user.id,
        },
      });

      return { msg: 'book successfully imported' };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async importBook(data, user) {
    const { role, email, id } = user;
    let { bookCode, importedQuantity } = data;

    try {
      if (!(role === 'ADMIN')) {
        throw new HttpException('Role Invalid!', HttpStatus.BAD_REQUEST);
      }

      if (!bookCode) {
        throw new HttpException('bookCode Invalid!', HttpStatus.BAD_REQUEST);
      }
      if (!importedQuantity) {
        throw new HttpException(
          'importedQuantity Invalid!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (isNaN(importedQuantity)) {
        throw new HttpException(
          'importedQuantity Invalid datatype!',
          HttpStatus.BAD_REQUEST,
        );
      }

      importedQuantity = Number(importedQuantity);

      const isBookExist = await this.prismaService.book.findUnique({
        where: {
          bookCode,
        },
      });

      if (!isBookExist) {
        throw new HttpException('BookCode not exist!', HttpStatus.BAD_REQUEST);
      }

      // DATA INSERTION
      // 1. BookStore Update
      // 2. BookI     ADD NEW ENTRY

      await this.prismaService.bookStore.update({
        data: {
          totalQuantity: {
            increment: importedQuantity,
          },
          availableQuantity: {
            increment: importedQuantity,
          },
        },
        where: {
          bookId: isBookExist.id,
        },
      });

      await this.prismaService.bookImport.create({
        data: {
          Quantity: importedQuantity,
          bookId: isBookExist.id,
          user_id: id,
        },
      });

      return {
        msg: 'Imported Successfully',
      };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  //bookId->code BookName,author importedQuantity, Date,
  async getBookImportedBookHistory(user, page) {
    try {
      const { limit, offset } = page;
      if (!(user.role === 'ADMIN')) {
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
          importedQuantity,
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

  async getLibrarianHistory(user, page) {
    try {
      const { limit, offset } = page;
      const librarianhistory = [];
      if (!(user.role === 'ADMIN')) {
        throw new HttpException('Invalid User!', HttpStatus.BAD_REQUEST);
      }
      if (!(limit && offset)) {
        throw new HttpException(
          'please check the pagination data',
          HttpStatus.BAD_REQUEST,
        );
      }
      const librarianDetails = await this.prismaService.user.findMany({
        where: { role: 'LIBRARIAN' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });
      if (!librarianDetails) {
        throw new HttpException('librarian not Found', HttpStatus.BAD_REQUEST);
      }
      for (const row in librarianDetails) {
        const bookData = librarianDetails[row];
        librarianhistory.push({
          id: bookData.id,
          name: bookData.name,
          email: bookData.email,
          Date: bookData.createdAt,
        });
      }

      return librarianhistory;
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async createNewLibrarian(data, user) {
    try {
      const { name, email, password } = data;
      if (!(user.role === 'ADMIN')) {
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
          'username is alredy exits plese change the username ',
          HttpStatus.BAD_REQUEST,
        );
      }
      const createLirarian = await this.prismaService.user.create({
        data: { name, email, password, role: 'LIBRARIAN' },
      });
      if (!createLirarian) {
        throw new HttpException(
          'librarian can not create please check agin',
          HttpStatus.BAD_REQUEST,
        );
      }
      return 'Librarian registerd Successfully';
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
}
