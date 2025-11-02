import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS cocktail_ingredients (
      cocktailId INTEGER NOT NULL,
      ingredientId INTEGER NOT NULL,
      PRIMARY KEY (cocktailId, ingredientId)
    )
  `);
  const cols: Array<{ name: string }> = await dataSource.query(
    'PRAGMA table_info(cocktail_ingredients)',
  );
  if (!cols.some((c) => c.name === 'quantity')) {
    await dataSource.query('ALTER TABLE cocktail_ingredients ADD COLUMN quantity TEXT');
  }

  await app.listen(3000);
}
bootstrap();