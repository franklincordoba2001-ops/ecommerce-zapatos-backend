import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdenesService {
  constructor(private prisma: PrismaService) {}

  private async getStockTalla(tx: any, zapatoId: number, talla: string) {
    return tx.stockTalla.findUnique({
      where: {
        zapatoId_talla: { zapatoId, talla },
      },
    });
  }

  async crear(usuarioId: number, body: { detalles: { zapatoId: number; cantidad: number; talla?: string }[]; direccionEnvio?: string; ciudad?: string; telefono?: string; metodoPago?: string }) {
    const { detalles, direccionEnvio, ciudad, telefono, metodoPago } = body;

    if (!detalles || detalles.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un calzado.');
    }

    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const detallesParaCrear: any[] = [];

      for (const item of detalles) {
        const zapato = await tx.zapato.findUnique({
          where: { id: item.zapatoId },
        });

        if (!zapato) {
          throw new NotFoundException(`El calzado con ID ${item.zapatoId} no existe.`);
        }

        const talla = typeof item.talla === 'string' ? item.talla.trim() : '';

        if (!talla) {
          throw new BadRequestException(`Debes seleccionar una talla para ${zapato.nombre}.`);
        }

        if (!zapato.tallas || zapato.tallas.length === 0) {
          throw new BadRequestException(`El calzado ${zapato.nombre} no tiene tallas configuradas.`);
        }

        if (!zapato.tallas.includes(talla)) {
          throw new BadRequestException(
            `La talla ${talla} no está disponible para ${zapato.nombre}. Tallas disponibles: ${zapato.tallas.join(', ')}.`,
          );
        }

        const stockTalla = await this.getStockTalla(tx, zapato.id, talla);

        if (!stockTalla || stockTalla.stock < item.cantidad) {
          const disponible = stockTalla?.stock ?? 0;
          throw new BadRequestException(
            `Stock insuficiente para ${zapato.nombre} talla ${talla}. Disponible: ${disponible}, solicitado: ${item.cantidad}.`,
          );
        }

        await tx.stockTalla.update({
          where: { id: stockTalla.id },
          data: { stock: stockTalla.stock - item.cantidad },
        });

        const subtotal = zapato.precio * item.cantidad;
        total += subtotal;

        detallesParaCrear.push({
          zapatoId: zapato.id,
          cantidad: item.cantidad,
          precio: zapato.precio,
          talla,
        });
      }

      const orden = await tx.orden.create({
        data: {
          usuarioId,
          total,
          estado: 'PENDIENTE',
          direccionEnvio: direccionEnvio || 'No especificada',
          ciudad: ciudad || 'No especificada',
          telefono: telefono || 'No especificado',
          metodoPago: metodoPago || 'EFECTIVO',
          detalles: {
            create: detallesParaCrear,
          },
        },
        include: {
          detalles: {
            include: {
              zapato: true,
            },
          },
        },
      });

      return orden;
    });
  }

  async listarMisCompras(usuarioId: number) {
    return this.prisma.orden.findMany({
      where: { usuarioId },
      include: {
        detalles: {
          include: {
            zapato: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listarTodas() {
    return this.prisma.orden.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
        detalles: {
          include: {
            zapato: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async actualizarEstado(id: number, estado: string) {
    const ordenValida = await this.prisma.orden.findUnique({
      where: { id },
      include: { detalles: true },
    });

    if (!ordenValida) {
      throw new NotFoundException('La orden no existe.');
    }

    const estadosPermitidos = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
    if (!estadosPermitidos.includes(estado.toUpperCase())) {
      throw new BadRequestException(
        `El estado "${estado}" no es válido. Estados permitidos: ${estadosPermitidos.join(', ')}`,
      );
    }

    const nuevoEstado = estado.toUpperCase();
    const antiguoEstado = ordenValida.estado;

    if (nuevoEstado === 'CANCELADO' && antiguoEstado !== 'CANCELADO') {
      await this.prisma.$transaction(async (tx) => {
        for (const detalle of ordenValida.detalles) {
          const stockTalla = await this.getStockTalla(tx, detalle.zapatoId, detalle.talla);
          if (stockTalla) {
            await tx.stockTalla.update({
              where: { id: stockTalla.id },
              data: { stock: { increment: detalle.cantidad } },
            });
          } else {
            await tx.stockTalla.create({
              data: {
                zapatoId: detalle.zapatoId,
                talla: detalle.talla,
                stock: detalle.cantidad,
              },
            });
          }
        }
      });
    } else if (antiguoEstado === 'CANCELADO' && nuevoEstado !== 'CANCELADO') {
      await this.prisma.$transaction(async (tx) => {
        for (const detalle of ordenValida.detalles) {
          const stockTalla = await this.getStockTalla(tx, detalle.zapatoId, detalle.talla);
          if (!stockTalla || stockTalla.stock < detalle.cantidad) {
            throw new BadRequestException(
              `No se puede reactivar la orden. Stock insuficiente para talla ${detalle.talla} del calzado ID ${detalle.zapatoId}.`,
            );
          }
          await tx.stockTalla.update({
            where: { id: stockTalla.id },
            data: { stock: { decrement: detalle.cantidad } },
          });
        }
      });
    }

    return this.prisma.orden.update({
      where: { id },
      data: { estado: nuevoEstado },
      include: {
        detalles: {
          include: {
            zapato: true,
          },
        },
      },
    });
  }
}
