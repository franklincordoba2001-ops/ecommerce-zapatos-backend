import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('categorias')
export class CategoriasController {

  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  crear(@Body('nombre') nombre: string) {
    return this.categoriasService.crear(nombre);
  }

  @Get()
  listar() {
    return this.categoriasService.listar();
  }

}
