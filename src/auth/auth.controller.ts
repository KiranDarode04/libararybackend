import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    const { username, password } = req.body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.generateToken(user);
    const {id,name,email,role}=user
    return {name,role,token};
  }

  @Post('registerUser')
  async RegisterUser(@Body() data: any) {
    const registerdData = await this.authService.ragisterUser(data);
    return registerdData;
  }
}
