import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {NotFoundException,UnauthorizedException,} from '@nestjs/common/exceptions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'http';
@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

 async registerAdmin(data){
      try {
        
      } catch (error) {
        
      }
  }
}
