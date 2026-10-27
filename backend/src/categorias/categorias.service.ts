import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriasService {

  constructor(private prisma: PrismaService) {}

  async crear(nombre: string) {
    const existe = await this.prisma.categoria.findUnique({
      where: { nombre },
    });

    if (existe) {
      throw new BadRequestException('La categoría ya existe');
    }

    return this.prisma.categoria.create({
      data: { nombre },
    });
  }

  async listar() {
    return this.prisma.categoria.findMany();
  }

}
