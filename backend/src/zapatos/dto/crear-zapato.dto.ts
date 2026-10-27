import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsArray, IsObject } from 'class-validator';

export class CrearZapatoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  precio: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsNumber({}, { message: 'El id de categoría debe ser un número' })
  @IsPositive({ message: 'El id de categoría debe ser válido' })
  categoriaId: number;

  @IsArray({ message: 'Las tallas deben ser una lista' })
  @IsString({ each: true, message: 'Cada talla debe ser un texto' })
  @IsNotEmpty({ each: true, message: 'Las tallas no pueden estar vacías' })
  tallas: string[];

  @IsObject({ message: 'El stock por talla debe ser un objeto' })
  @IsOptional()
  stockPorTalla?: Record<string, number>;
}
