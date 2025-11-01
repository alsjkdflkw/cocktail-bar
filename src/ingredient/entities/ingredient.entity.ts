import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cocktail } from '../../cocktail/entities/cocktail.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique : true})
  name: string; // nazwa

  @Column({ type: 'text' }) 
  description: string;

  @Column({ default: false }) 
  isAlcoholic: boolean;

  @Column({ nullable: true })
  photo: string;

  @ManyToMany(() => Cocktail, (cocktail) => cocktail.ingredients)
  cocktails: Cocktail[];
}