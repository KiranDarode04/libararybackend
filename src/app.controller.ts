import { Controller, Get,Post,Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    return this.appService.test();
  }

  @Post("registerUser")
  RegisterUser(@Body()  data:any){

  }


}

