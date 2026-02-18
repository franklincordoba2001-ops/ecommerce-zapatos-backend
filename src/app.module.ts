import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { ZapatosModule } from './zapatos/zapatos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UsuariosModule, PrismaModule, ZapatosModule, CategoriasModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
