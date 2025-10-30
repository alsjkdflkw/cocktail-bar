import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cocktail } from './cocktail.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';

@Entity()
export class CocktailIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: string; // e.g., "50ml", "2 oz", "1 dash"

  @ManyToOne(() => Cocktail, (cocktail) => cocktail.cocktailIngredients, {
    onDelete: 'CASCADE',
  })
  cocktail: Cocktail;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.cocktailIngredients, {
    onDelete: 'CASCADE',
  })
  ingredient: Ingredient;
}
