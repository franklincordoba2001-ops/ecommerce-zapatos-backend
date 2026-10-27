import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {

    const Usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!Usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValida = await bcrypt.compare(password, Usuario.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: Usuario.id,
      email: Usuario.email,
      rol: Usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
