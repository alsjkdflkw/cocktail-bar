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
import { CocktailService } from './cocktail.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('cocktails')
@Controller('cocktail')
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cocktail' })
  @ApiResponse({ status: 201, description: 'Cocktail created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'Cocktail with this name already exists',
  })
  create(@Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailService.create(createCocktailDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all cocktails with optional filtering and sorting',
  })
  @ApiQuery({
    name: 'ingredientId',
    required: false,
    description: 'Filter by ingredient ID',
  })
  @ApiQuery({
    name: 'nonAlcoholic',
    required: false,
    description: 'Filter non-alcoholic cocktails (true/false)',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'category', 'id'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @ApiResponse({ status: 200, description: 'List of cocktails' })
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
  @ApiOperation({ summary: 'Get a cocktail by ID' })
  @ApiResponse({ status: 200, description: 'Cocktail found' })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  findOne(@Param('id') id: string) {
    return this.cocktailService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cocktail' })
  @ApiResponse({ status: 200, description: 'Cocktail updated successfully' })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  update(
    @Param('id') id: string,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailService.update(+id, updateCocktailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cocktail' })
  @ApiResponse({ status: 200, description: 'Cocktail deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  remove(@Param('id') id: string) {
    return this.cocktailService.remove(+id);
  }
}
