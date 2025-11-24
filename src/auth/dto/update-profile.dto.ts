import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

