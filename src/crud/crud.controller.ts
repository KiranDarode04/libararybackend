import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @Get('getStudent')
  async getStudent() {
    return await this.crudService.getStudent();
  }

  @Post('addStudent')
  async addStudent(@Body() students: any) {
    return await this.crudService.addStudent(students);
  }

  @Delete('deleteStudent')
  async deleteStudent(@Query() id:any) {
    return await this.crudService.deleteStudent(id);
  }
  @Put('updateStudent')
  async updateStudent(@Body() data:any){
    return await this.crudService.updateStudent(data);
  }
}
