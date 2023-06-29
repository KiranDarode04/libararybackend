import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class CrudService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStudent() {
    try {
      const getStudent = await this.prismaService.student.findMany();
      if (getStudent) {
        return getStudent;
      } else {
        throw new HttpException(
          'student data not found.!',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.info(getStudent);
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async addStudent(students) {
    try {
      const { name, email, password } = students;
      const createStudent = await this.prismaService.student.create({
        data: {
          name,
          email,
          password,
        },
      });
      return createStudent;
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async deleteStudent(id: string) {
    try {
      const deleteStudent = await this.prismaService.student.delete({
        where: {id},
      });
      console.info(deleteStudent);
      if (deleteStudent) {
        return { deletedRecord: deleteStudent };
      } else {
        throw new HttpException(
          'student id not found.!',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {}
  }

  async updateStudent(data) {
    try {
      const { id, name, email, password } = data;
      const updateStudent = await this.prismaService.student.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          password,
        },
      });
      console.info(updateStudent);
    } catch (error) {}
  }
}
