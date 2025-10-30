import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(@InjectRepository(Ingredient) private ingredientRepository : Repository<Ingredient>) {}
  
  async create(createIngredientDto: CreateIngredientDto) {
    const newIngredient = this.ingredientRepository.create(createIngredientDto);

    try {
      return await this.ingredientRepository.save(newIngredient);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('An ingredient with this name is already added.');
      }
      
      throw new InternalServerErrorException();
    }

    return this.ingredientRepository.save(newIngredient);
  }

  async findAll(filters?: {
    isAlcoholic?: boolean;
    sortBy?: 'name' | 'id';
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const queryBuilder = this.ingredientRepository.createQueryBuilder('ingredient');

    // Filter by alcoholic status
    if (filters?.isAlcoholic !== undefined) {
      queryBuilder.andWhere('ingredient.isAlcoholic = :isAlcoholic', {
        isAlcoholic: filters.isAlcoholic,
      });
    }

    // Sorting
    const sortBy = filters?.sortBy || 'id';
    const sortOrder = filters?.sortOrder || 'ASC';
    queryBuilder.orderBy(`ingredient.${sortBy}`, sortOrder);

    return queryBuilder.getMany();
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