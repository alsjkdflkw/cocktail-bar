import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty({ message: 'Nazwa jest wymagana' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Opis jest wymagany' })
  description: string;

  @IsBoolean()
  @IsOptional()
  isAlcoholic?: boolean;

  @IsString()
  @IsOptional()
  photo?: string;
}