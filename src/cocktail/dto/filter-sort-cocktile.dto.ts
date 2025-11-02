import { Transform } from 'class-transformer';
import { IsBooleanString, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class FilterSortCocktailsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsInt()
  ingredientId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return undefined;
    const arr = value
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => !Number.isNaN(n));
    return arr.length ? arr : undefined;
  })
  ingredientIds?: number[];

  @IsOptional()
  @IsIn(['any', 'all'])
  ingredientsMode?: 'any' | 'all' = 'any';

  @IsOptional()
  @IsBooleanString()
  alcoholFree?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Math.max(1, Number(value)) : undefined))
  @IsInt()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Math.min(100, Math.max(1, Number(value))) : undefined))
  @IsInt()
  limit?: number;
}