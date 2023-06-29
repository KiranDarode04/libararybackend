import { Controller, Post, Request, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { AuthGuardService } from 'src/auth-guard/auth-guard.service';
import { RegisterUserDto } from './Dto/registerDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private jwtService: JwtService) {}

  @Post('login')
  async login(@Request() req) {
    const { email, password } = req.body;
  
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { id: user.id, email: user.email ,role:user.role};
    return {
      ...payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  @Post('registerUser')
  async RegisterUser(@Body() data: RegisterUserDto) {
    const registerdData = await this.authService.ragisterUser(data);
    return registerdData;
  }


  @Get('profile')
  @UseGuards(AuthGuardService)
  async profile(@Request() req){
    return req.user;
  }


}
