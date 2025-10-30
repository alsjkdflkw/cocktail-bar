import { Ingredient } from "src/ingredient/entities/ingredient.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cocktail {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string

    @Column()
    category : string

    @Column() 
    description : string

    @OneToMany(() => Ingredient, (ingredient) => ingredient.cocktail, {
    cascade: true, 
  })
  ingredients: Ingredient[]; 
}
