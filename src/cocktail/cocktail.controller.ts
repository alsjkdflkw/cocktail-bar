import { Controller, Post, Body, Get, Param, Patch, Delete, Put, Query } from '@nestjs/common';
import { CocktailService } from './cocktail.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { FilterSortCocktailsDto } from './dto/filter-sort-cocktile.dto';

type CreateWithIngredients = CreateCocktailDto & { ingredientIds?: number[] };
type UpdateWithIngredients = UpdateCocktailDto & { ingredientIds?: number[] };

@Controller('cocktail')
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Post()
  create(@Body() body: CreateWithIngredients) {
    return this.cocktailService.create(body);
  }

  @Put(':id')
  putOne(@Param('id') id: string, @Body() dto: UpdateWithIngredients) {
    return this.cocktailService.update(+id, dto);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() dto: UpdateWithIngredients) {
    return this.cocktailService.update(+id, dto);
  }

  @Get()
  findAll(@Query() query: FilterSortCocktailsDto) {
    return this.cocktailService.findAllFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cocktailService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cocktailService.remove(+id);
  }
}