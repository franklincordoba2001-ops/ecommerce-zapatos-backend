import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('usuarios')
export class UsuariosController {

  constructor(private usuariosService: UsuariosService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN') // Solo los usuarios con el rol 'admin' pueden acceder a este endpoint

  
  @Get()
  findAll() {
    return  this.usuariosService.findAll();
  }


  @Post()
  crear(@Body() body: any) {
    return this.usuariosService.crear(body);
  }

  @Get()
  listar() {
    return this.usuariosService.findAll();
  }

}
