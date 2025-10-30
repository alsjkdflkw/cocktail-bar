import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Cocktail } from '../../cocktail/entities/cocktail.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // nazwa

  @Column({ type: 'text' }) 
  description: string;

  @Column({ default: false }) 
  isAlcoholic: boolean;

  @Column({ nullable: true })
  photo: string;

  @ManyToOne(() => Cocktail, (cocktail) => cocktail.ingredients, {
    onDelete: 'CASCADE', 
  })
  @JoinColumn({ name: 'cocktailId' }) 
  cocktail: Cocktail;
}
