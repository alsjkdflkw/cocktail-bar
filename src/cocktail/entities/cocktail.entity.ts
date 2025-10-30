import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CocktailIngredient } from './cocktail-ingredient.entity';

@Entity()
export class Cocktail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  category: string;

  @Column({ type: 'text' })
  instruction: string;

  @OneToMany(
    () => CocktailIngredient,
    (cocktailIngredient) => cocktailIngredient.cocktail,
    {
      cascade: true,
      eager: true,
    },
  )
  cocktailIngredients: CocktailIngredient[];
}
