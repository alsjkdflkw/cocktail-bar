import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CocktailService } from './cocktail.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';

@Controller('cocktail')
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Post()
  create(@Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailService.create(createCocktailDto);
  }

  @Get()
  findAll(
    @Query('ingredientId') ingredientId?: string,
    @Query('nonAlcoholic') nonAlcoholic?: string,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: 'name' | 'category' | 'id',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.cocktailService.findAll({
      ingredientId: ingredientId ? +ingredientId : undefined,
      nonAlcoholic: nonAlcoholic === 'true',
      category,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cocktailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCocktailDto: UpdateCocktailDto) {
    return this.cocktailService.update(+id, updateCocktailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cocktailService.remove(+id);
  }
}
