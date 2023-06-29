import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UnauthorizedException,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}


  async validateUser(username: string, password: string): Promise<any> {
    const validateUser = await this.prismaService.user.findFirst({
      where: {
        email: username,
        password: password,
      },
    });
    return validateUser;
  }
  async generateToken(user: any): Promise<string> {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }


  async ragisterUser(data: any) {
    const {  email, password, role,name } = data;
    if (
      Object.keys(email).length  == 0 &&  
      Object.keys(password).length == 0 &&
      Object.keys(role).length == 0
    ) 
    {
      throw new ServiceUnavailableException(
        'data not fullfilld to register user',
      );
    }
 
    if (role === 'STUDENT' || role === 'ADMIN' || role === 'LIBRARIAN') {
      try {
        const {  email, password, role,name } = data;
        const findDuplicateUser = await this.prismaService.user.findUnique({
          where: { email: email },
        });
        if (!findDuplicateUser) {
          const register = await this.prismaService.user.create({
            data: {name,email, password, role },
          });

          return register;
        } else {
          return 'username is alrady exits';
        }
      } catch (error) {
        throw new ServiceUnavailableException(
          'User not Register please check data',
        );
      }
    } else {
      throw new ServiceUnavailableException('make sure role');
    }
  }

   


}
