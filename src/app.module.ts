import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { CrudModule } from './crud/crud.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { AuthGuardModule } from './auth-guard/auth-guard.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';


@Module({
  imports: [AdminModule, PrismaModule, CrudModule, StudentModule, AuthModule, BookModule, AuthGuardModule],
  controllers: [AppController],
  providers: [AppService,PrismaService,AuthGuardService],
})
export class AppModule {}
