import { IsDefined, IsEmail, IsNotEmpty,isDefined } from 'class-validator';

export class RegisterUserDto {

  @IsEmail()
  @IsDefined()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  password: string;

  @IsEmail()
  @IsDefined()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  role: string;
}