import { Module } from '@nestjs/common';
import { LibrarianService } from './librarian.service';

@Module({
  providers: [LibrarianService]
})
export class LibrarianModule {}
