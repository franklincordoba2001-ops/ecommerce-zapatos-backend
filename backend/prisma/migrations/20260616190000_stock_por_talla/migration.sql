-- CreateTable
CREATE TABLE "StockTalla" (
    "id" SERIAL NOT NULL,
    "zapatoId" INTEGER NOT NULL,
    "talla" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StockTalla_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockTalla_zapatoId_talla_key" ON "StockTalla"("zapatoId", "talla");

-- AddForeignKey
ALTER TABLE "StockTalla" ADD CONSTRAINT "StockTalla_zapatoId_fkey" FOREIGN KEY ("zapatoId") REFERENCES "Zapato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing stock per talla (0 for all except first talla gets full stock)
INSERT INTO "StockTalla" ("zapatoId", "talla", "stock")
SELECT z.id, t.talla, 0
FROM "Zapato" z
CROSS JOIN LATERAL unnest(
  CASE
    WHEN array_length(z.tallas, 1) > 0 THEN z.tallas
    ELSE ARRAY['Única']::TEXT[]
  END
) AS t(talla);

UPDATE "StockTalla" st
SET stock = z.stock
FROM "Zapato" z
WHERE st."zapatoId" = z.id
  AND st.id = (
    SELECT MIN(st2.id)
    FROM "StockTalla" st2
    WHERE st2."zapatoId" = z.id
  );

-- DropColumn
ALTER TABLE "Zapato" DROP COLUMN "stock";
