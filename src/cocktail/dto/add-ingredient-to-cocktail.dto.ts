import { IsArray, ArrayNotEmpty, IsInt, IsPositive } from 'class-validator';

export class AddIngredientToCocktailsDto {
  @IsInt()
  @IsPositive()
  ingredientId: number;

  @IsArray()
  @ArrayNotEmpty()
  cocktailIds: number[];
}