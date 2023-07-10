import { Module } from '@nestjs/common';
import { LibrarianService } from './librarian.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {PrismaModule} from 'src/prisma/prisma.module';
import {LibrarianController} from 'src/librarian/librarian.controller';
@Module({
  imports:[PrismaModule],
  providers: [LibrarianService],
  controllers:[LibrarianController]
})
export class LibrarianModule {}
