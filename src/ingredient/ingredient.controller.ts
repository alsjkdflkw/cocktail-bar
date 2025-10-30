import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('ingredients')
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({ status: 201, description: 'Ingredient created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'Ingredient with this name already exists',
  })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all ingredients with optional filtering and sorting',
  })
  @ApiQuery({
    name: 'isAlcoholic',
    required: false,
    description: 'Filter by alcoholic status (true/false)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'id'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @ApiResponse({ status: 200, description: 'List of ingredients' })
  findAll(
    @Query('isAlcoholic') isAlcoholic?: string,
    @Query('sortBy') sortBy?: 'name' | 'id',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.ingredientService.findAll({
      isAlcoholic:
        isAlcoholic === 'true'
          ? true
          : isAlcoholic === 'false'
            ? false
            : undefined,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ingredient by ID' })
  @ApiResponse({ status: 200, description: 'Ingredient found' })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ingredient' })
  @ApiResponse({ status: 200, description: 'Ingredient updated successfully' })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ingredient' })
  @ApiResponse({ status: 200, description: 'Ingredient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  remove(@Param('id') id: string) {
    return this.ingredientService.remove(+id);
  }
}
