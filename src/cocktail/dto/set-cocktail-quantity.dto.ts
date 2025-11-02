import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CocktailQuantitesItemDto {
  @IsInt()
  @IsPositive()
  ingredientId: number;

  @IsString()
  @IsOptional()
  quantity?: string; 
}

export class SetCocktailQuantitesDto {
  @IsInt()
  @IsPositive()
  cocktailId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CocktailQuantitesItemDto)
  items: CocktailQuantitesItemDto[];
}