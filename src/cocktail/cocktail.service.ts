import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { FilterSortCocktailsDto } from './dto/filter-sort-cocktile.dto';

type CreateWithIngredients = CreateCocktailDto & { ingredientIds?: number[] };
type UpdateWithIngredients = UpdateCocktailDto & { ingredientIds?: number[] };
type IngredientPair = [number, string];
type IngredientItem = {
  id?: number;
  name?: string;
  description?: string;
  isAlcoholic?: boolean;
  quantity: string;
};

@Injectable()
export class CocktailService {
  constructor(
    @InjectRepository(Cocktail)
    private readonly cocktailRepository: Repository<Cocktail>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  private async loadIngredientsOrThrow(ids?: number[]) {
    if (!ids || !ids.length) return undefined;
    const found = await this.ingredientRepository.find({ where: { id: In(ids) } });
    if (found.length !== ids.length) {
      const ok = new Set(found.map((i) => i.id));
      const missing = ids.filter((x) => !ok.has(x));
      throw new NotFoundException(`Ingredient IDs not found: ${missing.join(', ')}`);
    }
    return found;
  }

  private async ensureIngredient(item: IngredientItem): Promise<Ingredient> {
    if (item.id != null) {
      const ing = await this.ingredientRepository.findOne({ where: { id: item.id } });
      if (!ing) throw new NotFoundException(`Ingredient not found: ${item.id}`);
      return ing;
    }
    if (!item.name?.trim() || item.isAlcoholic == null) {
      throw new BadRequestException('New ingredient requires name and isAlcoholic');
    }
    const ing = this.ingredientRepository.create({
      name: item.name.trim(),
      description: item.description ?? '',
      isAlcoholic: item.isAlcoholic,
    });
    return this.ingredientRepository.save(ing);
  }

  private async upsertQuantity(cocktailId: number, ingredientId: number, quantity: string) {
    await this.cocktailRepository.manager.query(
      `INSERT INTO cocktail_ingredients (cocktailId, ingredientId, quantity)
       VALUES (?, ?, ?)
       ON CONFLICT(cocktailId, ingredientId) DO UPDATE SET quantity = excluded.quantity`,
      [cocktailId, ingredientId, quantity],
    );
  }

  async create(dto: CreateWithIngredients) {
    const pairs: IngredientPair[] = (((dto as any).ingredientPairs as IngredientPair[]) ?? []);
    const items: IngredientItem[] = (((dto as any).ingredientItems as IngredientItem[]) ?? []);

    const itemResults: Ingredient[] = [];
    const itemQty = new Map<number, string>();
    for (const it of items) {
      const ing = await this.ensureIngredient(it);
      itemResults.push(ing);
      itemQty.set(ing.id, String(it.quantity));
    }

    const pairIds = Array.from(new Set(pairs.map(([id]) => id)));
    const providedIds = Array.from(new Set([...(dto.ingredientIds ?? []), ...pairIds]));
    const missingIds = providedIds.filter((id) => !itemResults.some((i) => i.id === id));
    const others = await this.loadIngredientsOrThrow(missingIds);

    const { ingredientIds: _drop, ...rest } = dto;
    const entity: Cocktail = this.cocktailRepository.create(rest as Partial<Cocktail>);
    (entity as any).ingredients = [...itemResults, ...(others ?? [])];

    const saved = await this.cocktailRepository.save(entity);

    for (const [ingId, qty] of itemQty) {
      await this.upsertQuantity(saved.id, ingId, qty);
    }
    for (const [ingId, qty] of pairs) {
      await this.upsertQuantity(saved.id, ingId, String(qty));
    }

    return this.findOne(saved.id);
  }

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

    if (name) qb.andWhere('cocktail.name LIKE :name', { name: `%${name}%` });
    if (category) qb.andWhere('cocktail.category = :category', { category });
    if (ingredientId) qb.andWhere('ingredient.id = :ingredientId', { ingredientId });

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
      const parts = sort.split(',').map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        const desc = p.startsWith('-');
        const key = desc ? p.slice(1) : p;
        const col = orderMap[key];
        if (col) qb.addOrderBy(col, desc ? 'DESC' : 'ASC');
      }
    } else {
      qb.addOrderBy('cocktail.name', 'ASC');
    }

    const take = limit ?? 50;
    const skip = page && limit ? (page - 1) * take : 0;
    qb.take(take).skip(skip);

    return qb.getMany();
  }

  async findOne(id: number) {
    const entity = await this.cocktailRepository.findOne({ where: { id }, relations: ['ingredients'] });
    if (!entity) throw new NotFoundException('Cocktail not found');
    return entity;
  }

  async update(id: number, dto: UpdateWithIngredients) {
    const pairs: IngredientPair[] = (((dto as any).ingredientPairs as IngredientPair[]) ?? []);
    const items: IngredientItem[] = (((dto as any).ingredientItems as IngredientItem[]) ?? []);

    const { ingredientIds, ...rest } = dto;
    await this.cocktailRepository.update(id, rest as any);

    const entity = await this.cocktailRepository.findOne({ where: { id }, relations: ['ingredients'] });
    if (!entity) throw new NotFoundException('Cocktail not found');

    const itemResults: Ingredient[] = [];
    const itemQty = new Map<number, string>();
    for (const it of items) {
      const ing = await this.ensureIngredient(it);
      itemResults.push(ing);
      itemQty.set(ing.id, String(it.quantity));
    }

    const pairIds = Array.from(new Set(pairs.map(([ingId]) => ingId)));
    const currentIds = new Set((entity.ingredients ?? []).map((i) => i.id));
    const baseIds =
      ingredientIds !== undefined ? new Set(ingredientIds) : new Set<number>([...currentIds]);
    for (const id2 of itemResults.map((i) => i.id)) baseIds.add(id2);
    for (const id2 of pairIds) baseIds.add(id2);

    const needLoad = Array.from(baseIds).filter((id2) => !itemResults.some((i) => i.id === id2));
    const others = await this.loadIngredientsOrThrow(needLoad);

    (entity as any).ingredients = [...itemResults, ...(others ?? [])];
    await this.cocktailRepository.save(entity);

    for (const [ingId, qty] of itemQty) {
      await this.upsertQuantity(id, ingId, qty);
    }
    for (const [ingId, qty] of pairs) {
      await this.upsertQuantity(id, ingId, String(qty));
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.cocktailRepository.delete(id);
    if (!res.affected) throw new NotFoundException('Cocktail not found');
    return { deleted: true };
  }
}