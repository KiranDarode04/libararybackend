import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UnauthorizedException,
  ServiceUnavailableException,
  NotFoundException,
  HttpException,
} from '@nestjs/common/exceptions';
import { RegisterUserDto } from './Dto/registerDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) { }


  async validateUser(email: string, password: string): Promise<any> {
    const validateUser = await this.prismaService.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    return validateUser;
  }
  async generateToken(user: any): Promise<string> {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }


  async ragisterUser(data: RegisterUserDto) {
    try {

      // Validation role
      switch (data.role) {
        case 'ADMIN':
        case 'STUDENT':
        case 'LIBRARIAN':
          break;
        default: throw new HttpException('Invalid Role!', HttpStatus.BAD_REQUEST)
      }

      const isExistUser = await this.prismaService.user.findUnique({
        where:{
          email:data.email
        }
      })

      if((isExistUser)){
        throw new HttpException('Email already exist!', HttpStatus.BAD_REQUEST)
      }

      const newUser = await this.prismaService.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.password,
          role: data.role
        }
      })

      if (!(newUser)) {
        throw new HttpException('Error to create new user!', HttpStatus.BAD_REQUEST)
      }

      return newUser;

    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST)
    }
  }




}
