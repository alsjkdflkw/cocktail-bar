import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { In, Repository } from 'typeorm';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { Ingredient } from 'src/ingredient/entities/ingredient.entity';
import { AddIngredientToCocktailsDto } from './dto/add-ingredient-to-cocktail.dto'; 
import { SetIngredientQuantityDto } from 'src/ingredient/entities/set-ingredient-quantity.dto';
import { FilterSortCocktailsDto } from './dto/filter-sort-cocktile.dto';

@Injectable()
export class CocktailService {
  constructor(
    @InjectRepository(Cocktail) private cocktailRepository: Repository<Cocktail>,
    @InjectRepository(Ingredient) private ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAllFiltered(dto: FilterSortCocktailsDto) {
    const {
      name,
      category,
      ingredientId,
      ingredientIds,
      ingredientsMode = 'any',
      alcoholFree,
      sort,
      page,
      limit,
    } = dto;

    const qb = this.cocktailRepository
      .createQueryBuilder('cocktail')
      .leftJoinAndSelect('cocktail.ingredients', 'ingredient')
      .distinct(true); 

    
    if (name) {
      qb.andWhere('cocktail.name LIKE :name', { name: `%${name}%` });
    }

    
    if (category) {
      qb.andWhere('cocktail.category = :category', { category });
    }

    
    if (ingredientId) {
      qb.andWhere('ingredient.id = :ingredientId', { ingredientId });
    }

    if (ingredientIds && ingredientIds.length) {
      if (ingredientsMode === 'any') {
        
        qb.andWhere('ingredient.id IN (:...ingIdsAny)', { ingIdsAny: ingredientIds });
      } else {
        
        ingredientIds.forEach((id, idx) => {
          qb.andWhere(
            `EXISTS (
              SELECT 1 FROM cocktail_ingredients ci
              WHERE ci.cocktailId = cocktail.id AND ci.ingredientId = :ingAll${idx}
            )`,
            { [`ingAll${idx}`]: id },
          );
        });
      }
    }

    
    if (alcoholFree === 'true') {
      qb.andWhere(
        `NOT EXISTS (
          SELECT 1
          FROM cocktail_ingredients ci
          JOIN ingredient ing2 ON ing2.id = ci.ingredientId
          WHERE ci.cocktailId = cocktail.id
            AND ing2.isAlcoholic = 1
        )`,
      );
    }

    
    const orderMap: Record<string, string> = {
      name: 'cocktail.name',
      category: 'cocktail.category',
      id: 'cocktail.id',
    };

    if (sort) {
      const parts = sort.split(',').map((x) => x.trim()).filter(Boolean);
      for (const p of parts) {
        const desc = p.startsWith('-');
        const key = desc ? p.slice(1) : p;
        const col = orderMap[key];
        if (col) {
          qb.addOrderBy(col, desc ? 'DESC' : 'ASC');
        }
      }
    } else {
      qb.addOrderBy('cocktail.name', 'ASC');
    }

    const take = limit ?? 50;
    const skip = page && limit ? (page - 1) * take : 0;
    qb.take(take).skip(skip);

    return qb.getMany();
  }


  async create(createCocktailDto: CreateCocktailDto) {
  const { ingredientIds, ...rest } =
    createCocktailDto as CreateCocktailDto & { ingredientIds?: number[] };

  const cocktail = this.cocktailRepository.create();
  Object.assign(cocktail, rest);

  if (Array.isArray(ingredientIds) && ingredientIds.length) {
    const ingredients = await this.ingredientRepository.find({ where: { id: In(ingredientIds) } });
    if (ingredients.length !== ingredientIds.length) {
      const found = new Set(ingredients.map((i) => i.id));
      const missing = ingredientIds.filter((id) => !found.has(id));
      throw new NotFoundException(`Ingredient IDs not found: ${missing.join(', ')}`);
    }
    cocktail.ingredients = ingredients;
  }

  const saved = await this.cocktailRepository.save(cocktail); 
  return this.findOne(saved.id);
}

  
  async findAll() {
    const cocktails = await this.cocktailRepository.find({
      relations: { ingredients: true },
    });

    return cocktails.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      ingredients: (c.ingredients || []).map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        isAlcoholic: i.isAlcoholic,
        photo: i.photo,
      })),
    }));
  }

  async findOne(id: number) {
    const c = await this.cocktailRepository.findOne({
      where: { id },
      relations: { ingredients: true },
    });
    if (!c) throw new NotFoundException(`Cocktail with ID "${id}" not found`);

    return {
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      ingredients: (c.ingredients || []).map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        isAlcoholic: i.isAlcoholic,
        photo: i.photo,
      })),
    };
  }

  async update(id: number, updateCocktailDto: UpdateCocktailDto) {
    const cocktail = await this.cocktailRepository.findOne({
      where: { id },
      relations: { ingredients: true },
    });
    if (!cocktail) throw new NotFoundException(`Cocktail with ID "${id}" not found`);

    const { ingredientIds, ...rest } = updateCocktailDto as any;

    Object.assign(cocktail, rest);

    if (Array.isArray(ingredientIds)) {
      if (ingredientIds.length === 0) {
        cocktail.ingredients = [];
      } else {
        const ingredients = await this.ingredientRepository.find({ where: { id: In(ingredientIds) } });
        if (ingredients.length !== ingredientIds.length) {
          const found = new Set(ingredients.map(i => i.id));
          const missing = ingredientIds.filter(id => !found.has(id));
          throw new NotFoundException(`Ingredient IDs not found: ${missing.join(', ')}`);
        }
        cocktail.ingredients = ingredients;
      }
    }

    return this.cocktailRepository.save(cocktail);
  }

  async remove(id: number) {
    const cocktail = await this.cocktailRepository.findOneBy({ id });
    if (!cocktail) {
      throw new NotFoundException(`Cocktail z ID "${id}" nie został znaleziony`);
    }
    return this.cocktailRepository.remove(cocktail);
  }

  async addIngredientToMany(dto: AddIngredientToCocktailsDto) {
    const { ingredientId, cocktailIds } = dto;

    const ingredient = await this.ingredientRepository.findOneBy({ id: ingredientId });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID "${ingredientId}" not found`);
    }

    const cocktails = await this.cocktailRepository.find({
      where: { id: In(cocktailIds) },
      relations: { ingredients: true },
    });

    if (cocktails.length !== cocktailIds.length) {
      const foundIds = new Set(cocktails.map((c) => c.id));
      const missing = cocktailIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Cocktail IDs not found: ${missing.join(', ')}`);
    }

    for (const cocktail of cocktails) {
      const has = (cocktail.ingredients || []).some((i) => i.id === ingredientId);
      if (!has) {
        cocktail.ingredients = [...(cocktail.ingredients || []), ingredient];
        await this.cocktailRepository.save(cocktail);
      }
    }

    return { updatedCocktailIds: cocktails.map((c) => c.id) };
  }

  async setIngredientQuantity(dto: SetIngredientQuantityDto) {
    const { cocktailId, ingredientId, quantity } = dto;

    const cocktail = await this.cocktailRepository.findOneBy({ id: cocktailId });
    if (!cocktail) throw new NotFoundException(`Cocktail with ID "${cocktailId}" not found`);
    const ingredient = await this.ingredientRepository.findOneBy({ id: ingredientId });
    if (!ingredient) throw new NotFoundException(`Ingredient with ID "${ingredientId}" not found`);

    await this.cocktailRepository.query(
      'INSERT OR IGNORE INTO cocktail_ingredients (cocktailId, ingredientId) VALUES (?, ?)',
      [cocktailId, ingredientId],
    );

    await this.cocktailRepository.query(
      'UPDATE cocktail_ingredients SET quantity = ? WHERE cocktailId = ? AND ingredientId = ?',
      [quantity.trim(), cocktailId, ingredientId],
    );

    return { cocktailId, ingredientId, quantity: quantity.trim() };
  }
}