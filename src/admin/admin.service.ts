import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
      }); //6<=3
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
        take: count,
      });

      return { librarian, student, book };
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

  async getLibrarianDetails(librarainId) {
    try {
      if (!librarainId) {
        throw new HttpException(
          'Enter the librarian id !',
          HttpStatus.BAD_REQUEST,
        );
      }
      const getLibrarianDetail = await this.prismaService.user.findFirst({
        where: {
          id: librarainId.librarainId,
          role: 'LIBRARIAN',
        },
      });
      return getLibrarianDetail;
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
  async getStudentDetails(studentId) {
    try {
      if (!studentId) {
        throw new HttpException(
          'Enter the librarian id !',
          HttpStatus.BAD_REQUEST,
        );
      }
      const getStudentDetails = await this.prismaService.user.findFirst({
        where: {
          id: studentId.studentId,
          role: 'STUDENT',
        },
      });
      return getStudentDetails;
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
}
