import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCocktailDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  ingredientIds?: number[];
}