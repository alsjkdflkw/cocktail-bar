import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  findAll(
    @Query('isAlcoholic') isAlcoholic?: string,
    @Query('sortBy') sortBy?: 'name' | 'id',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.ingredientService.findAll({
      isAlcoholic: isAlcoholic === 'true' ? true : isAlcoholic === 'false' ? false : undefined,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientService.remove(+id);
  }
}
