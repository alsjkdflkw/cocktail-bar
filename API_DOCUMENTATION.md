# Cocktail Bar REST API

REST API for managing cocktails and ingredients in a cocktail bar. Built with NestJS, TypeScript, and TypeORM.

## Features

- ✅ Full CRUD operations for cocktails and ingredients
- ✅ Many-to-many relationship between cocktails and ingredients with quantities
- ✅ Input validation using class-validator
- ✅ Filtering and sorting capabilities
- ✅ Swagger/OpenAPI documentation
- ✅ SQLite database
- ✅ RESTful API design

## Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM for database management
- **SQLite** - Lightweight database
- **Swagger** - API documentation
- **class-validator** - Request validation

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build
npm run build
```

The API will be available at `http://localhost:3000`

## API Documentation

Interactive API documentation is available at `http://localhost:3000/api` when the application is running.

## API Endpoints

### Cocktails

#### Create Cocktail
```http
POST /cocktail
Content-Type: application/json

{
  "name": "Mojito",
  "category": "Classic",
  "instruction": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
  "ingredients": [
    { "ingredientId": 1, "quantity": "50ml" },
    { "ingredientId": 2, "quantity": "20ml" }
  ]
}
```

#### Get All Cocktails
```http
GET /cocktail
```

**Query Parameters:**
- `ingredientId` - Filter by ingredient ID
- `nonAlcoholic` - Filter non-alcoholic cocktails (true/false)
- `category` - Filter by category
- `sortBy` - Sort by field (name, category, id)
- `sortOrder` - Sort order (ASC, DESC)

**Examples:**
```http
GET /cocktail?ingredientId=1
GET /cocktail?nonAlcoholic=true
GET /cocktail?category=Classic&sortBy=name&sortOrder=ASC
```

#### Get Cocktail by ID
```http
GET /cocktail/:id
```

#### Update Cocktail
```http
PATCH /cocktail/:id
Content-Type: application/json

{
  "name": "Mojito Deluxe",
  "ingredients": [
    { "ingredientId": 1, "quantity": "60ml" }
  ]
}
```

#### Delete Cocktail
```http
DELETE /cocktail/:id
```

### Ingredients

#### Create Ingredient
```http
POST /ingredient
Content-Type: application/json

{
  "name": "White Rum",
  "description": "Light rum, perfect for cocktails",
  "isAlcoholic": true,
  "photo": "https://example.com/rum.jpg"
}
```

#### Get All Ingredients
```http
GET /ingredient
```

**Query Parameters:**
- `isAlcoholic` - Filter by alcoholic status (true/false)
- `sortBy` - Sort by field (name, id)
- `sortOrder` - Sort order (ASC, DESC)

**Examples:**
```http
GET /ingredient?isAlcoholic=true
GET /ingredient?sortBy=name&sortOrder=ASC
```

#### Get Ingredient by ID
```http
GET /ingredient/:id
```

#### Update Ingredient
```http
PATCH /ingredient/:id
Content-Type: application/json

{
  "description": "Updated description"
}
```

#### Delete Ingredient
```http
DELETE /ingredient/:id
```

## Data Models

### Cocktail
- `id` (number) - Unique identifier
- `name` (string) - Name of the cocktail (unique)
- `category` (string) - Category (e.g., Classic, Modern)
- `instruction` (string) - Preparation instructions
- `cocktailIngredients` - List of ingredients with quantities

### Ingredient
- `id` (number) - Unique identifier
- `name` (string) - Name of the ingredient (unique)
- `description` (string) - Description
- `isAlcoholic` (boolean) - Contains alcohol
- `photo` (string, optional) - Photo URL

### CocktailIngredient (Junction table)
- `id` (number) - Unique identifier
- `quantity` (string) - Quantity (e.g., "50ml", "2 oz")
- `cocktailId` (number) - Reference to cocktail
- `ingredientId` (number) - Reference to ingredient

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed database documentation.

## Examples

### Create a complete cocktail with ingredients

1. Create ingredients:
```bash
curl -X POST http://localhost:3000/ingredient \
  -H "Content-Type: application/json" \
  -d '{"name": "Vodka", "description": "Premium vodka", "isAlcoholic": true}'

curl -X POST http://localhost:3000/ingredient \
  -H "Content-Type: application/json" \
  -d '{"name": "Orange Juice", "description": "Fresh orange juice", "isAlcoholic": false}'
```

2. Create cocktail:
```bash
curl -X POST http://localhost:3000/cocktail \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Screwdriver",
    "category": "Classic",
    "instruction": "Fill glass with ice. Add vodka and orange juice. Stir well.",
    "ingredients": [
      {"ingredientId": 1, "quantity": "50ml"},
      {"ingredientId": 2, "quantity": "150ml"}
    ]
  }'
```

### Find all non-alcoholic cocktails
```bash
curl http://localhost:3000/cocktail?nonAlcoholic=true
```

### Find cocktails containing a specific ingredient
```bash
curl http://localhost:3000/cocktail?ingredientId=1
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── cocktail/
│   ├── dto/
│   │   ├── create-cocktail.dto.ts
│   │   └── update-cocktail.dto.ts
│   ├── entities/
│   │   ├── cocktail.entity.ts
│   │   └── cocktail-ingredient.entity.ts
│   ├── cocktail.controller.ts
│   ├── cocktail.service.ts
│   └── cocktail.module.ts
├── ingredient/
│   ├── dto/
│   │   ├── create-ingredient.dto.ts
│   │   └── update-ingredient.dto.ts
│   ├── entities/
│   │   └── ingredient.entity.ts
│   ├── ingredient.controller.ts
│   ├── ingredient.service.ts
│   └── ingredient.module.ts
├── app.module.ts
└── main.ts
```

## REST API Principles

This API follows REST principles:
- Resource-based URLs (`/cocktail`, `/ingredient`)
- HTTP methods for CRUD (POST, GET, PATCH, DELETE)
- Proper HTTP status codes
- JSON request/response bodies
- Stateless communication

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful GET/PATCH/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource

## License

UNLICENSED
