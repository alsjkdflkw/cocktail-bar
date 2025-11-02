import { IsInt, IsPositive, IsString } from 'class-validator';

export class SetIngredientQuantityDto {
  @IsInt()
  @IsPositive()
  cocktailId: number;

  @IsInt()
  @IsPositive()
  ingredientId: number;

  @IsString()
  quantity: string; 
}