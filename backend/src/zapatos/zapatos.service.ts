import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetZapatosQueryDto } from './dto/get-zapatos-query.dto';

type StockPorTallaInput = Record<string, number>;

@Injectable()
export class ZapatosService {
  constructor(private prisma: PrismaService) {}

  private formatZapato(zapato: any) {
    const stockPorTalla: StockPorTallaInput = {};
    for (const entry of zapato.stockTallas || []) {
      stockPorTalla[entry.talla] = entry.stock;
    }
    const stock = Object.values(stockPorTalla).reduce((sum, qty) => sum + qty, 0);
    const { stockTallas, ...rest } = zapato;
    return { ...rest, stockPorTalla, stock };
  }

  private parseStockPorTalla(
    stockPorTalla: StockPorTallaInput | undefined,
    tallas: string[],
  ): { talla: string; stock: number }[] {
    if (!stockPorTalla || typeof stockPorTalla !== 'object') {
      return tallas.map((talla) => ({ talla, stock: 0 }));
    }

    return tallas.map((talla) => {
      const raw = stockPorTalla[talla];
      const stock = typeof raw === 'number' ? raw : parseInt(String(raw ?? 0), 10);
      if (Number.isNaN(stock) || stock < 0) {
        throw new BadRequestException(`Stock inválido para la talla ${talla}`);
      }
      return { talla, stock };
    });
  }

  private normalizeTallas(tallas: string[] | undefined): string[] {
    if (!Array.isArray(tallas)) return [];
    return [...new Set(tallas.map((t) => String(t).trim()).filter(Boolean))];
  }

  async crear(data: any) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    });

    if (!categoria) {
      throw new BadRequestException('La categoría no existe');
    }

    const tallas = this.normalizeTallas(data.tallas);
    if (tallas.length === 0) {
      throw new BadRequestException('Debes configurar al menos una talla');
    }

    const stockEntries = this.parseStockPorTalla(data.stockPorTalla, tallas);

    const created = await this.prisma.zapato.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        imagenUrl: data.imagenUrl,
        categoriaId: data.categoriaId,
        tallas,
        stockTallas: {
          create: stockEntries,
        },
      },
      include: {
        categoria: true,
        stockTallas: true,
      },
    });

    return this.formatZapato(created);
  }

  async listar(query: GetZapatosQueryDto) {
    const { page, limit, categoriaId, search, sortBy } = query;

    // Construir objeto orderBy
    const orderBy: any = {};
    if (sortBy === 'price-asc') {
      orderBy.precio = 'asc';
    } else if (sortBy === 'price-desc') {
      orderBy.precio = 'desc';
    } else if (sortBy === 'name-asc') {
      orderBy.nombre = 'asc';
    } else {
      orderBy.id = 'desc'; // más nuevo primero
    }

    // Si no hay parámetros de paginación, devolver la lista completa
    if (page === undefined && limit === undefined) {
      const where: any = {};
      if (categoriaId) {
        where.categoriaId = categoriaId;
      }
      if (search) {
        where.OR = [
          { nombre: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
        ];
      }
      const zapatos = await this.prisma.zapato.findMany({
        where,
        include: {
          categoria: true,
          stockTallas: true,
        },
        orderBy,
      });
      return zapatos.map((z) => this.formatZapato(z));
    }

    const pageNum = Number(page || 1);
    const limitNum = Number(limit || 12);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (categoriaId) {
      where.categoriaId = categoriaId;
    }
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, zapatos] = await Promise.all([
      this.prisma.zapato.count({ where }),
      this.prisma.zapato.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          categoria: true,
          stockTallas: true,
        },
        orderBy,
      }),
    ]);

    const formatted = zapatos.map((z) => this.formatZapato(z));
    const totalPages = Math.ceil(total / limitNum);

    return {
      data: formatted,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  async buscarPorId(id: number) {
    const zapato = await this.prisma.zapato.findUnique({
      where: { id },
      include: {
        categoria: true,
        stockTallas: true,
      },
    });

    if (!zapato) return null;
    return this.formatZapato(zapato);
  }

  async actualizar(id: number, data: any) {
    const zapato = await this.prisma.zapato.findUnique({
      where: { id },
      include: { stockTallas: true },
    });

    if (!zapato) {
      throw new BadRequestException('El calzado no existe');
    }

    if (data.categoriaId) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: data.categoriaId },
      });

      if (!categoria) {
        throw new BadRequestException('La categoría no existe');
      }
    }

    const tallas = data.tallas !== undefined ? this.normalizeTallas(data.tallas) : zapato.tallas;
    if (tallas.length === 0) {
      throw new BadRequestException('Debes configurar al menos una talla');
    }

    const stockEntries =
      data.stockPorTalla !== undefined
        ? this.parseStockPorTalla(data.stockPorTalla, tallas)
        : null;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (stockEntries) {
        await tx.stockTalla.deleteMany({ where: { zapatoId: id } });
        await tx.stockTalla.createMany({
          data: stockEntries.map((entry) => ({
            zapatoId: id,
            talla: entry.talla,
            stock: entry.stock,
          })),
        });
      } else if (data.tallas !== undefined) {
        const existingMap = new Map(zapato.stockTallas.map((s) => [s.talla, s.stock]));
        await tx.stockTalla.deleteMany({ where: { zapatoId: id } });
        await tx.stockTalla.createMany({
          data: tallas.map((talla) => ({
            zapatoId: id,
            talla,
            stock: existingMap.get(talla) ?? 0,
          })),
        });
      }

      return tx.zapato.update({
        where: { id },
        data: {
          ...(data.nombre !== undefined && { nombre: data.nombre }),
          ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
          ...(data.precio !== undefined && { precio: data.precio }),
          ...(data.imagenUrl !== undefined && { imagenUrl: data.imagenUrl }),
          ...(data.categoriaId !== undefined && { categoriaId: data.categoriaId }),
          ...(data.tallas !== undefined && { tallas }),
        },
        include: {
          categoria: true,
          stockTallas: true,
        },
      });
    });

    return this.formatZapato(updated);
  }

  async eliminar(id: number) {
    const zapato = await this.prisma.zapato.findUnique({
      where: { id },
    });

    if (!zapato) {
      throw new BadRequestException('El calzado no existe');
    }

    await this.prisma.zapato.delete({ where: { id } });
    return { message: 'Calzado eliminado' };
  }
}
