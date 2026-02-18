import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ZapatosService } from './zapatos.service';

@Controller('zapatos')
export class ZapatosController {

  constructor(private zapatosService: ZapatosService) {}

  @Post()
  crear(@Body() body: any) {
    return this.zapatosService.crear(body);
  }

  @Get()
  listar() {
    return this.zapatosService.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.zapatosService.buscarPorId(Number(id));
  }

}
