import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsArray, IsObject } from 'class-validator';

export class ActualizarZapatoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsNumber({}, { message: 'El id de categoría debe ser un número' })
  @IsPositive({ message: 'El id de categoría debe ser válido' })
  @IsOptional()
  categoriaId?: number;

  @IsArray({ message: 'Las tallas deben ser una lista' })
  @IsString({ each: true, message: 'Cada talla debe ser un texto' })
  @IsNotEmpty({ each: true, message: 'Las tallas no pueden estar vacías' })
  @IsOptional()
  tallas?: string[];

  @IsObject({ message: 'El stock por talla debe ser un objeto' })
  @IsOptional()
  stockPorTalla?: Record<string, number>;
}
