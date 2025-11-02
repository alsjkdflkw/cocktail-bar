import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { CocktailController } from './cocktail.controller';
import { CocktailService } from './cocktail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktail, Ingredient])],
  controllers: [CocktailController],
  providers: [CocktailService],
  exports: [CocktailService],
})
export class CocktailModule {}