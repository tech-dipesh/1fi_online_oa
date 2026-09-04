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
