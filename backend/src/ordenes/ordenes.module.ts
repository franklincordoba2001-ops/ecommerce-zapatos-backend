import { Module } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OrdenesService],
  controllers: [OrdenesController],
  exports: [OrdenesService],
})
export class OrdenesModule {}
