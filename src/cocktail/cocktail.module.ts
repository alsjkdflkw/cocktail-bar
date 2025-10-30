import { Module } from '@nestjs/common';
import { CocktailService } from './cocktail.service';
import { CocktailController } from './cocktail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { CocktailIngredient } from './entities/cocktail-ingredient.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktail, CocktailIngredient, Ingredient])],
  controllers: [CocktailController],
  providers: [CocktailService],
})
export class CocktailModule {}
