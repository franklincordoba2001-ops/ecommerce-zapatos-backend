import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

type CrearUsuarioInput = {
  nombre?: unknown;
  email?: unknown;
  password?: unknown;
};

const usuarioPublicSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  createdAt: true,
};

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async crear(data: CrearUsuarioInput) {
    const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    const password = typeof data.password === 'string' ? data.password : '';

    if (!nombre || !email || !password) {
      throw new BadRequestException('Nombre, email y contraseña son obligatorios');
    }

    if (!email.includes('@')) {
      throw new BadRequestException('El email no tiene un formato válido');
    }

    if (password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    const existe = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existe) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
      },
      select: usuarioPublicSelect,
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: usuarioPublicSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
