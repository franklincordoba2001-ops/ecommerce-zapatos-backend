import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {

  constructor(private categoriasService: CategoriasService) {}

  @Post()
  crear(@Body('nombre') nombre: string) {
    return this.categoriasService.crear(nombre);
  }

  @Get()
  listar() {
    return this.categoriasService.listar();
  }

}
