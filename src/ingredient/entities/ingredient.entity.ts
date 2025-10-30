import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CocktailIngredient } from '../../cocktail/entities/cocktail-ingredient.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isAlcoholic: boolean;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(
    () => CocktailIngredient,
    (cocktailIngredient) => cocktailIngredient.ingredient,
  )
  cocktailIngredients: CocktailIngredient[];
}
