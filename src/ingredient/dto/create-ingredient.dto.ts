import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({ description: 'Name of the ingredient', example: 'Vodka' })
  @IsString()
  @IsNotEmpty({ message: 'Nazwa jest wymagana' })
  name: string;

  @ApiProperty({
    description: 'Description of the ingredient',
    example: 'Premium vodka from Poland',
  })
  @IsString()
  @IsNotEmpty({ message: 'Opis jest wymagany' })
  description: string;

  @ApiPropertyOptional({
    description: 'Whether the ingredient contains alcohol',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isAlcoholic?: boolean;

  @ApiPropertyOptional({
    description: 'URL to ingredient photo',
    example: 'https://example.com/vodka.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;
}
