import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CocktailService {
  constructor(@InjectRepository(Cocktail) private cocktailRepository : Repository<Cocktail>) {}

  create(createCocktailDto: CreateCocktailDto) {
    const newCocktail = this.cocktailRepository.create(createCocktailDto);

    return this.cocktailRepository.save(newCocktail);
  }

  findAll() {
    return this.cocktailRepository.find();
  }

  findOne(id: number) {
    return this.cocktailRepository.findOneBy({id});
  }

  async update(id: number, updateCocktailDto: UpdateCocktailDto) {
    const cocktail = await this.findOne(id);
    return this.cocktailRepository.save({ ...cocktail, ...updateCocktailDto});
  }

  async remove(id: number) {
  const cocktail = await this.cocktailRepository.findOneBy({ id });

  if (!cocktail) {
    throw new NotFoundException(`Cocktail z ID "${id}" nie został znaleziony`);
  }

  return this.cocktailRepository.remove(cocktail);
}
}
