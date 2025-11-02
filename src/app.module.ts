import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CocktailModule } from './cocktail/cocktail.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', 
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
    }),
    CocktailModule,
    IngredientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
