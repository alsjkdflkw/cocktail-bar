import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CocktailIngredientDto {
  @ApiProperty({ description: 'ID of the ingredient', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  ingredientId: number;

  @ApiProperty({ description: 'Quantity of the ingredient', example: '50ml' })
  @IsString()
  @IsNotEmpty()
  quantity: string;
}

export class CreateCocktailDto {
  @ApiProperty({ description: 'Name of the cocktail', example: 'Mojito' })
  @IsString()
  @IsNotEmpty({ message: 'Nazwa koktajlu jest wymagana' })
  name: string;

  @ApiProperty({ description: 'Category of the cocktail', example: 'Classic' })
  @IsString()
  @IsNotEmpty({ message: 'Kategoria jest wymagana' })
  category: string;

  @ApiProperty({
    description: 'Instructions for making the cocktail',
    example: 'Mix all ingredients with ice',
  })
  @IsString()
  @IsNotEmpty({ message: 'Instrukcja jest wymagana' })
  instruction: string;

  @ApiProperty({
    description: 'List of ingredients with quantities',
    type: [CocktailIngredientDto],
    example: [{ ingredientId: 1, quantity: '50ml' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CocktailIngredientDto)
  ingredients: CocktailIngredientDto[];
}
