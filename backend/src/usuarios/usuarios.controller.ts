import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

type CrearUsuarioBody = {
  nombre?: unknown;
  email?: unknown;
  password?: unknown;
};

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.usuariosService.findAll();
  }

  @Post()
  crear(@Body() body: CrearUsuarioBody) {
    return this.usuariosService.crear(body);
  }
}
