import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {

  constructor(private prisma: PrismaService) {}

  async crear(data: any) {
    return this.prisma.usuario.create({
      data,
    });
  }

  async listar() {
    return this.prisma.usuario.findMany();
  }

}
