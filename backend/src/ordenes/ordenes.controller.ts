import { Controller, Get, Post, Patch, Body, Req, Param, UseGuards } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ordenes')
@UseGuards(JwtAuthGuard)
export class OrdenesController {
  constructor(private ordenesService: OrdenesService) {}

  @Post()
  crear(@Req() req: any, @Body() body: { detalles: { zapatoId: number; cantidad: number; talla?: string }[] }) {
    const usuarioId = req.user.id;
    return this.ordenesService.crear(usuarioId, body);
  }

  @Get('mis-compras')
  listarMisCompras(@Req() req: any) {
    const usuarioId = req.user.id;
    return this.ordenesService.listarMisCompras(usuarioId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listarTodas() {
    return this.ordenesService.listarTodas();
  }

  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  actualizarEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.ordenesService.actualizarEstado(Number(id), estado);
  }
}
