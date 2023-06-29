import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}
  
 async deleteUserData() {
   try {
    
    const deleteData=await this.prismaService.user.deleteMany({});
    return deleteData;
      
   } catch (error) {
    console.info(error);
   }
  }

  async test(data) {
    try {
      const { username } = data;

      const isEmailEixts = await this.prismaService.user.deleteMany({});
      // findUnique({
      //   where: {
      //     email: data['email'],
      //   },
      // });
      // console.info(isEmailEixts);

      // if (isEmailEixts) {
      //   console.log('email is alraday exits.');
      //   throw new HttpException(
      //     'email is alrady exits.!',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      // const newUser = await this.prismaService.user.create({
      //   data: {
      //     email: data.email,
      //     password: data['password'],
      //     username: username,
      //   },
      // });
      // console.info(newUser);
      return { name: 'vaibhav' };
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
}
