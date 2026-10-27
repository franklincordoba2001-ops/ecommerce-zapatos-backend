import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ZapatosService } from './zapatos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CrearZapatoDto } from './dto/crear-zapato.dto';
import { ActualizarZapatoDto } from './dto/actualizar-zapato.dto';
import { GetZapatosQueryDto } from './dto/get-zapatos-query.dto';

@Controller('zapatos')
export class ZapatosController {

  constructor(private zapatosService: ZapatosService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `zapato-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new BadRequestException('Solo se permiten archivos de imagen (PNG, JPG, JPEG, WEBP, GIF)'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB máximo
    }
  }))
  uploadImagen(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Por favor, selecciona un archivo de imagen válido.');
    }
    const publicUrlBase = process.env.API_PUBLIC_URL ? process.env.API_PUBLIC_URL.replace(/\/$/, '') : '';
    return { imageUrl: `${publicUrlBase}/uploads/${file.filename}` };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  crear(@Body() body: CrearZapatoDto) {
    return this.zapatosService.crear(body);
  }

  @Get()
  listar(@Query() query: GetZapatosQueryDto) {
    return this.zapatosService.listar(query);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.zapatosService.buscarPorId(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  actualizar(@Param('id') id: string, @Body() body: ActualizarZapatoDto) {
    return this.zapatosService.actualizar(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  eliminar(@Param('id') id: string) {
    return this.zapatosService.eliminar(Number(id));
  }

}
