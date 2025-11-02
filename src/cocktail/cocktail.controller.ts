import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CocktailService } from './cocktail.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { AddIngredientToCocktailsDto } from './dto/add-ingredient-to-cocktail.dto';
import { SetIngredientQuantityDto } from 'src/ingredient/entities/set-ingredient-quantity.dto';

@Controller('cocktail')
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Post()
  create(@Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailService.create(createCocktailDto);
  }

  @Get()
  findAll() {
    return this.cocktailService.findAll();
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

  @Post('ingredients/add-to-many')
  addIngredientToMany(@Body() dto: AddIngredientToCocktailsDto) {
    return this.cocktailService.addIngredientToMany(dto);
  }

  // New: set quantity on the join table without changing relations
  @Post('ingredients/set-quantity')
  setIngredientQuantity(@Body() dto: SetIngredientQuantityDto) {
    return this.cocktailService.setIngredientQuantity(dto);
  }
}