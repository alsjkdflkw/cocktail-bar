import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CocktailIngredientDto {
  @IsNumber()
  @IsNotEmpty()
  ingredientId: number;

  @IsString()
  @IsNotEmpty()
  quantity: string;
}

export class CreateCocktailDto {
  @IsString()
  @IsNotEmpty({ message: 'Nazwa koktajlu jest wymagana' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategoria jest wymagana' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Instrukcja jest wymagana' })
  instruction: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CocktailIngredientDto)
  ingredients: CocktailIngredientDto[];
}