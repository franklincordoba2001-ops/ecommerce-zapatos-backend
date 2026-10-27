-- AlterTable
ALTER TABLE "DetalleOrden" ADD COLUMN     "talla" TEXT NOT NULL DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "Zapato" ADD COLUMN     "tallas" TEXT[] DEFAULT ARRAY[]::TEXT[];
