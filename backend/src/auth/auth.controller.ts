import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginBody) {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son obligatorios');
    }

    return this.authService.login(email, password);
  }

}
