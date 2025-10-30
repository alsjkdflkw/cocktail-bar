import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { Repository } from 'typeorm';
import { CocktailIngredient } from './entities/cocktail-ingredient.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';

@Injectable()
export class CocktailService {
  constructor(
    @InjectRepository(Cocktail)
    private cocktailRepository: Repository<Cocktail>,
    @InjectRepository(CocktailIngredient)
    private cocktailIngredientRepository: Repository<CocktailIngredient>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createCocktailDto: CreateCocktailDto) {
    const { ingredients, ...cocktailData } = createCocktailDto;

    // Create the cocktail
    const newCocktail = this.cocktailRepository.create(cocktailData);

    try {
      const savedCocktail = await this.cocktailRepository.save(newCocktail);

      // Create cocktail-ingredient relationships
      if (ingredients && ingredients.length > 0) {
        const cocktailIngredients: CocktailIngredient[] = [];
        for (const ingredientDto of ingredients) {
          const ingredient = await this.ingredientRepository.findOneBy({
            id: ingredientDto.ingredientId,
          });

          if (!ingredient) {
            throw new NotFoundException(
              `Ingredient with ID ${ingredientDto.ingredientId} not found`,
            );
          }

          const cocktailIngredient = this.cocktailIngredientRepository.create({
            cocktail: savedCocktail,
            ingredient: ingredient,
            quantity: ingredientDto.quantity,
          });

          cocktailIngredients.push(cocktailIngredient);
        }

        await this.cocktailIngredientRepository.save(cocktailIngredients);
      }

      return this.findOne(savedCocktail.id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        throw new ConflictException('A cocktail with this name already exists.');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return this.cocktailRepository.find({
      relations: ['cocktailIngredients', 'cocktailIngredients.ingredient'],
    });
  }

  async findOne(id: number) {
    const cocktail = await this.cocktailRepository.findOne({
      where: { id },
      relations: ['cocktailIngredients', 'cocktailIngredients.ingredient'],
    });

    if (!cocktail) {
      throw new NotFoundException(`Cocktail with ID ${id} not found`);
    }

    return cocktail;
  }

  async update(id: number, updateCocktailDto: UpdateCocktailDto) {
    const cocktail = await this.findOne(id);
    const { ingredients, ...cocktailData } = updateCocktailDto;

    // Update cocktail data
    Object.assign(cocktail, cocktailData);
    await this.cocktailRepository.save(cocktail);

    // Update ingredients if provided
    if (ingredients) {
      // Remove existing ingredients
      await this.cocktailIngredientRepository.delete({ cocktail: { id } });

      // Add new ingredients
      if (ingredients.length > 0) {
        const cocktailIngredients: CocktailIngredient[] = [];
        for (const ingredientDto of ingredients) {
          const ingredient = await this.ingredientRepository.findOneBy({
            id: ingredientDto.ingredientId,
          });

          if (!ingredient) {
            throw new NotFoundException(
              `Ingredient with ID ${ingredientDto.ingredientId} not found`,
            );
          }

          const cocktailIngredient = this.cocktailIngredientRepository.create({
            cocktail: cocktail,
            ingredient: ingredient,
            quantity: ingredientDto.quantity,
          });

          cocktailIngredients.push(cocktailIngredient);
        }

        await this.cocktailIngredientRepository.save(cocktailIngredients);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const cocktail = await this.findOne(id);
    return this.cocktailRepository.remove(cocktail);
  }
}
