import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZapatosService {

  constructor(private prisma: PrismaService) {}

  async crear(data: any) {

    // 🔎 Validar que la categoría exista
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    });

    if (!categoria) {
      throw new BadRequestException('La categoría no existe');
    }

    return this.prisma.zapato.create({
      data,
    });
  }

  async listar() {
    return this.prisma.zapato.findMany({
      include: {
        categoria: true,
      },
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.zapato.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });
  }

}
