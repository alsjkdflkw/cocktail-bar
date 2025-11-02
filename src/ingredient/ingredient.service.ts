import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { isUniqueConstraintViolation } from '../common/db-error.util';

@Injectable()
export class IngredientService {
  constructor(@InjectRepository(Ingredient) private ingredientRepository : Repository<Ingredient>) {}
  
  async create(createIngredientDto: CreateIngredientDto) {
    const newIngredient = this.ingredientRepository.create(createIngredientDto);

    try {
      return await this.ingredientRepository.save(newIngredient);
    } catch (error: any) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException('An ingredient with this name is already added.');
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.ingredientRepository.find();
  }

  findOne(id: number) {
    return this.ingredientRepository.findOneBy({id});
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    return this.ingredientRepository.save({ ...ingredient, ...updateIngredientDto});
  }

  async remove(id: number) {
    const ingredient = await this.ingredientRepository.findOneBy({ id });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID "${id}" was not FOUND`);
    }

    return this.ingredientRepository.remove(ingredient);
  }
}