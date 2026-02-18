import { Module } from '@nestjs/common';
import { ZapatosService } from './zapatos.service';
import { ZapatosController } from './zapatos.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [ZapatosService],
  controllers: [ZapatosController]
})
export class ZapatosModule {}
