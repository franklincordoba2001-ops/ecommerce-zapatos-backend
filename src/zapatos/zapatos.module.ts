import { Module } from '@nestjs/common';
import { ZapatosService } from './zapatos.service';
import { ZapatosController } from './zapatos.controller';

@Module({
  providers: [ZapatosService],
  controllers: [ZapatosController]
})
export class ZapatosModule {}
