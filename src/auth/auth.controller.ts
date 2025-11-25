import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req: any) {
    return this.authService.refresh(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }
}
