# Database Schema Documentation

## Overview
This database supports a cocktail bar management system with a many-to-many relationship between cocktails and ingredients.

## Entities

### Cocktail
Represents a cocktail recipe.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | number | PRIMARY KEY, AUTO INCREMENT | Unique identifier |
| name | string | UNIQUE, NOT NULL | Name of the cocktail |
| category | string | NOT NULL | Category (e.g., Classic, Modern, Non-Alcoholic) |
| instruction | text | NOT NULL | Step-by-step instructions for making the cocktail |

### Ingredient
Represents an ingredient that can be used in cocktails.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | number | PRIMARY KEY, AUTO INCREMENT | Unique identifier |
| name | string | UNIQUE, NOT NULL | Name of the ingredient |
| description | text | NOT NULL | Description of the ingredient |
| isAlcoholic | boolean | DEFAULT false | Whether the ingredient contains alcohol |
| photo | string | NULLABLE | URL to a photo of the ingredient |

### CocktailIngredient
Junction table for the many-to-many relationship between cocktails and ingredients. Includes the quantity of each ingredient needed for a cocktail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | number | PRIMARY KEY, AUTO INCREMENT | Unique identifier |
| quantity | string | NOT NULL | Quantity needed (e.g., "50ml", "2 oz", "1 dash") |
| cocktailId | number | FOREIGN KEY (CASCADE DELETE) | Reference to Cocktail |
| ingredientId | number | FOREIGN KEY (CASCADE DELETE) | Reference to Ingredient |

## Relationships

```
Cocktail (1) ←→ (N) CocktailIngredient (N) ←→ (1) Ingredient
```

- A **Cocktail** can have many **CocktailIngredients** (many ingredients)
- An **Ingredient** can be used in many **CocktailIngredients** (many cocktails)
- **CocktailIngredient** stores the quantity for each ingredient-cocktail combination

## Database Diagram

```
┌─────────────────┐
│    Cocktail     │
├─────────────────┤
│ id              │◄────┐
│ name            │     │
│ category        │     │
│ instruction     │     │
└─────────────────┘     │
                        │
                ┌───────┴──────────────┐
                │ CocktailIngredient   │
                ├──────────────────────┤
                │ id                   │
                │ quantity             │
                │ cocktailId (FK)      │
                │ ingredientId (FK)    │
                └───────┬──────────────┘
                        │
                        ▼
┌─────────────────┐
│   Ingredient    │
├─────────────────┤
│ id              │
│ name            │
│ description     │
│ isAlcoholic     │
│ photo           │
└─────────────────┘
```

## Example Data

### Cocktail
```json
{
  "id": 1,
  "name": "Mojito",
  "category": "Classic",
  "instruction": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water."
}
```

### Ingredient
```json
{
  "id": 1,
  "name": "White Rum",
  "description": "Light rum, perfect for cocktails",
  "isAlcoholic": true,
  "photo": "https://example.com/rum.jpg"
}
```

### CocktailIngredient
```json
{
  "id": 1,
  "quantity": "50ml",
  "cocktailId": 1,
  "ingredientId": 1
}
```

## Notes
- All cascade deletions are enabled to maintain referential integrity
- Unique constraints on names prevent duplicate entries
- The many-to-many relationship allows ingredients to be reused across multiple cocktails
- Quantities are stored as strings to allow flexible units (ml, oz, dashes, etc.)
