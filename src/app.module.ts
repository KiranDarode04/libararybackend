import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { AuthGuardModule } from './auth-guard/auth-guard.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { LibrarianController } from './librarian/librarian.controller';
import { LibrarianModule } from './librarian/librarian.module';


@Module({
  imports: [AdminModule, PrismaModule, StudentModule, AuthModule, BookModule, AuthGuardModule, LibrarianModule],
  controllers: [AppController, LibrarianController],
  providers: [AppService,PrismaService,AuthGuardService],
})
export class AppModule {}
