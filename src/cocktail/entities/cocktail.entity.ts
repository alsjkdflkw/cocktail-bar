import { Ingredient } from "src/ingredient/entities/ingredient.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cocktail {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique : true})
    name : string

    @Column()
    category : string

    @Column() 
    description : string

    @ManyToMany(() => Ingredient, (ingredient) => ingredient.cocktails)
    @JoinTable({ name: 'cocktail_ingredients' }) // join table
    ingredients: Ingredient[]; 
  
}
