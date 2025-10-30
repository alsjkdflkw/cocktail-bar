
import { IsNotEmpty, IsString } from 'class-validator';


export class CreateCocktailDto {
  @IsString()
  @IsNotEmpty({ message: 'Nazwa koktajlu jest wymagana' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategoria jest wymagana' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Opis jest wymagany' })
  description: string;
}