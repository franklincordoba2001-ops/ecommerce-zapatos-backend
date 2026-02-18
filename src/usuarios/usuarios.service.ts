import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  

  constructor(private prisma: PrismaService) {}

  async crear(data: any) {

  const existe = await this.prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (existe) {
    throw new BadRequestException('El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return this.prisma.usuario.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  }); }


  async findAll() {
    return this.prisma.usuario.findMany();
  }

}
