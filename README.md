# Cocktail Bar API

NestJS + TypeORM (SQLite). Zarządzanie koktajlami, składnikami oraz ilościami składników na relacji wielu‑do‑wielu.

## Szybki start

- Wymagania: Node 18+, npm lub pnpm, sqlite3 (CLI opcjonalnie)
- Instalacja:
  - npm i
- Uruchomienie:
  - npm run start:dev

Baza danych: plik `db.sqlite` w katalogu projektu.

## Schemat danych

- Tabela `cocktail` (id, name, category, description)
- Tabela `ingredient` (id, name, description, isAlcoholic, photo?)
- Relacja : `cocktail_ingredients`
  - Kolumny: `cocktailId`, `ingredientId`, `quantity` (TEXT)
  - Nazwy tabeli i kolumn są przypięte w `@JoinTable` w encji `Cocktail`.


## Endpointy

- POST /ingredient
  - Body: { name, description, isAlcoholic, photo? }
- GET /ingredient

- POST /cocktail
  - Body: { name, category, description, ingredientIds?: number[] }
- GET /cocktail
  - Wspiera filtrowanie, sortowanie, paginację (sekcja niżej).
- GET /cocktail/:id
- PATCH /cocktail/:id
- DELETE /cocktail/:id

- POST /cocktail/ingredients/set-quantity
  - Body: { cocktailId: number, ingredientId: number, quantity: string }
  - Tworzy wiersz w join‑table (jeśli brak), aktualizuje `quantity`, zwraca { cocktailId, ingredientId, quantity }.


## Filtrowanie, sortowanie, paginacja (GET /cocktail)

Obsługiwane parametry zapytania (patrz `FilterSortCocktailsDto` i `findAllFiltered`):

- name: string (LIKE %name%)
- category: string (dokładne dopasowanie)
- ingredientId: number (koktajle zawierające dany składnik)
- ingredientIds: lista liczb, np. `1,4,5`
- ingredientsMode: `any` | `all` (dla `ingredientIds`)
- alcoholFree: 'true' | 'false' (true = bezalkoholowe)
- sort: np. `name`, `-name`, `category,name`, `id`, `-id`
- page: number (>=1)
- limit: number (1..100)

## Przykłady curl

Ustawienie BASE:
```
export BASE=http://localhost:3000
```

Składniki:
```
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/ingredient" -d '{"name":"White Rum","description":"Light rum","isAlcoholic":true}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/ingredient" -d '{"name":"Tequila","description":"Blue agave spirit","isAlcoholic":true}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/ingredient" -d '{"name":"Triple Sec","description":"Orange liqueur","isAlcoholic":true}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/ingredient" -d '{"name":"Lime Juice","description":"Freshly squeezed lime","isAlcoholic":false}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/ingredient" -d '{"name":"Sugar Syrup","description":"Simple syrup 1:1","isAlcoholic":false}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/ingredient" -d '{"name":"Mint Leaves","description":"Fresh mint leaves","isAlcoholic":false}'
```

Koktajle z podlinkowaniem składników przez `ingredientIds`:
```
# Mojito
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail" -d '{"name":"Mojito","category":"Classic","description":"Minty rum highball","ingredientIds":[1,4,5,6]}'
# Daiquiri
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail" -d '{"name":"Daiquiri","category":"Classic","description":"Rum, lime, sugar","ingredientIds":[1,4,5]}'
# Margarita
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail" -d '{"name":"Margarita","category":"Classic","description":"Tequila, triple sec, lime","ingredientIds":[2,3,4]}'
```

Ustawienie ilości na relacji:
```
# Mojito (cocktailId=1): Rum(1), Lime(4), Sugar(5), Mint(6)
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":1,"ingredientId":1,"quantity":"50 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":1,"ingredientId":4,"quantity":"25 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":1,"ingredientId":5,"quantity":"15 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":1,"ingredientId":6,"quantity":"8 leaves"}'

# Daiquiri (cocktailId=2): Rum(1), Lime(4), Sugar(5)
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":2,"ingredientId":1,"quantity":"60 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":2,"ingredientId":4,"quantity":"30 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":2,"ingredientId":5,"quantity":"15 ml"}'

# Margarita (cocktailId=3): Tequila(2), Triple Sec(3), Lime(4)
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":3,"ingredientId":2,"quantity":"50 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":3,"ingredientId":3,"quantity":"25 ml"}'
curl -sS -H 'Content-Type: application/json' -X POST "$BASE/cocktail/ingredients/set-quantity" -d '{"cocktailId":3,"ingredientId":4,"quantity":"25 ml"}'
```

Filtrowanie i sortowanie:
```
# Koktajle zawierające składnik 1
curl -sS "$BASE/cocktail?ingredientId=1"

# Koktajle zawierające wszystkie składniki 1 i 4, sort malejąco po nazwie
curl -sS "$BASE/cocktail?ingredientIds=1,4&ingredientsMode=all&sort=-name"

# Bezalkoholowe, sort po kategorii i nazwie
curl -sS "$BASE/cocktail?alcoholFree=true&sort=category,name"

# Szukaj po nazwie i kategorii
curl -sS "$BASE/cocktail?name=marg&category=Classic"

# Paginacja: strona 2 po 10 wyników, sort po id malejąco
curl -sS "$BASE/cocktail?limit=10&page=2&sort=-id"
```
