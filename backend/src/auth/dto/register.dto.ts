import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  myname: string;

  @IsNotEmpty()
  @IsString()
  picture: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
