# EMI Plans
Browse smartphones, pick a variant, and choose an EMI plan backed by mutual funds — every plan is computed at request time from a price-bracket rule table.

## Tech stack
- **Framework:** Next.js 16.3.4 (App Router), React 19.2.8 
- **Language**: Typescript 6.0.3 (Stable Version, we can't go with 7 due ot unsupported typescript-eslint)
- **Styling:** Tailwind CSS 4.3.3
- **Database:** PostgreSQL (Deployable on neon)
- **ORM:** Prisma 7.10.0 (it'll be connects through the `@prisma/adapter-pg` driver adapter)
- **Validation:** Zod 4.5.4
- **Linting:** ESLint 9.39.5
- **Package manager:** pnpm

## How EMI plans work
Planners are **not** stored in rows per product. Instead, there is a planner table named `EmiRule`, which stores the price range (`minPrice` to `maxPrice`) of the product, and every rule contains a tenure, interest, and cashback percentage. For every requested product variant, its price is matched with the rules stored in the rule table, thereby dynamically constructing the plan list of the particular product variant. Every rule can be either global (`productId` field is set to `null`) or product-specific; however, in case of conflict between two rules having the same tenure, the product-specific rule will be preferred over the global rule.


```
EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
```
This is the P is the Price, r is monthly interest rate and the n is total month. but for the zero interest simple p/t

## Setup and run instructions
``` bash
pn install
pn generate
pn seed
pn push
pn dev
```
This creates 5 products (10 variants total) and the global + product-override EMI rules.
Visit `http://localhost:3000`.

## API endpoints
### `GET /api/products`
```json
[
  {
    "id": "cme...",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "startingPrice": 127400,
    "imageUrl": "https://www.deccanchronicle.com/h-upload/2025/01/10/1880313-17.webp"
  }
]
```

### `GET /api/products/:slug`
```json
{
  "id": "cme...",
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "description": "Apple's flagship Pro smartphone with an A19 Pro chip and a 48MP triple camera system.",
  "variants": [
    {
      "id": "cme...",
      "label": "256GB",
      "storage": "256GB",
      "color": null,
      "mrp": 134900,
      "price": 127400,
      "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Cosmic_Orange_iPhone_17_Pro_Max_2026-08-09_Apple_02.jpg",
      "emiPlans": [
        {
          "tenureMonths": 3,
          "interestRate": 0,
          "monthlyAmount": 42467,
          "cashbackAmount": 11466,
          "cashbackPercent": 9,
          "totalPayable": 127401
        },
        {
          "tenureMonths": 36,
          "interestRate": 10.5,
          "monthlyAmount": 4134,
          "cashbackAmount": 7644,
          "cashbackPercent": 6,
          "totalPayable": 148824
        }
      ]
    }
  ]
}
```

Returns `404` with `{ "error": "Product not found" }` for an unknown slug.

### `POST /api/selections`
Validated with Zod. Recomputes the plan server-side from the variant's current price and the rule table — the client only sends the variant and tenure it wants, never a monthly amount.

**Request body:**

```json
{
  "variantId": "cme...",
  "tenureMonths": 12
}
```

Response:
```json
{
  "id": "cme...",
  "variantId": "cme...",
  "tenureMonths": 12,
  "interestRate": 0,
  "monthlyAmount": 10617,
  "cashbackAmount": 11466,
  "totalPayable": 127404,
  "createdAt": "2026-09-03T12:00:00.000Z"
}
```
