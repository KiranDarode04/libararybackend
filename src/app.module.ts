import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { CrudModule } from './crud/crud.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';


@Module({
  imports: [AdminModule, PrismaModule, CrudModule, StudentModule, AuthModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
