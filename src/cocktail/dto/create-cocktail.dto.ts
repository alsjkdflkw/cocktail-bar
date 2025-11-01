
import { IsNotEmpty, IsString } from 'class-validator';


export class CreateCocktailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}