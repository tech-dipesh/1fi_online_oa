import db from "@/lib/db"

type VariantSeed = {
  label: string
  storage: string
  mrp: number
  price: number
  imageUrl: string
}

type ProductSeed = {
  slug: string
  name: string
  brand: string
  description: string
  variants: VariantSeed[]
}

const iphone17ProImage = "https://www.deccanchronicle.com/h-upload/2025/01/10/1880313-17.webp"
const iphone17Image = "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/317417_0_7ISiBcc4Y.png"
const galaxyS25UltraImage = "https://static0.pocketlintimages.com/wordpress/wp-content/uploads/wm/2025/01/galaxy-s25-ultra-header-1.jpg"
const galaxyZFold7Image = "https://rukminim2.flixcart.com/image/480/640/xif0q/mobile/e/c/y/-original-imahgfnyyegswvdz.jpeg?q=90"
const onePlus13Image = "https://wifihifi.com/wp-content/uploads/2024/12/oneplus-13-upright.jpg"

const products: ProductSeed[] = [
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    description: "Apple's flagship Pro smartphone with an A19 Pro chip and a 48MP triple camera system.",
    variants: [
      { label: "256GB", storage: "256GB", mrp: 134900, price: 127400, imageUrl: iphone17ProImage },
      { label: "512GB", storage: "512GB", mrp: 154900, price: 146900, imageUrl: iphone17ProImage }
    ]
  },
  {
    slug: "iphone-17",
    name: "iPhone 17",
    brand: "Apple",
    description: "The standard iPhone 17 with a brighter display and an A19 chip.",
    variants: [
      { label: "128GB", storage: "128GB", mrp: 82900, price: 79900, imageUrl: iphone17Image },
      { label: "256GB", storage: "256GB", mrp: 92900, price: 89900, imageUrl: iphone17Image }
    ]
  },
  {
    slug: "galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    description: "Samsung's Ultra flagship with a titanium frame and a 200MP main camera.",
    variants: [
      { label: "256GB", storage: "256GB", mrp: 129999, price: 119999, imageUrl: galaxyS25UltraImage },
      { label: "512GB", storage: "512GB", mrp: 144999, price: 134999, imageUrl: galaxyS25UltraImage }
    ]
  },
  {
    slug: "galaxy-z-fold-7",
    name: "Samsung Galaxy Z Fold 7",
    brand: "Samsung",
    description: "Samsung's book-style foldable with a slimmer hinge and a large inner display.",
    variants: [
      { label: "256GB", storage: "256GB", mrp: 174999, price: 164999, imageUrl: galaxyZFold7Image },
      { label: "512GB", storage: "512GB", mrp: 194999, price: 184999, imageUrl: galaxyZFold7Image }
    ]
  },
  {
    slug: "oneplus-13",
    name: "OnePlus 13",
    brand: "OnePlus",
    description: "OnePlus's flagship with a Snapdragon 8 Elite chip and fast charging.",
    variants: [
      { label: "256GB", storage: "256GB", mrp: 69999, price: 64999, imageUrl: onePlus13Image },
      { label: "512GB", storage: "512GB", mrp: 79999, price: 74999, imageUrl: onePlus13Image }
    ]
  }
]

const zeroInterestTenures = [3, 6, 12, 24]
const interestBearingTenures = [36, 48, 60]
const interestBearingRate = 10.5

type PriceBracket = {
  minPrice: number
  maxPrice: number
  cashbackPercent: number
}

const priceBrackets: PriceBracket[] = [
  { minPrice: 0, maxPrice: 70000, cashbackPercent: 4 },
  { minPrice: 70001, maxPrice: 120000, cashbackPercent: 5 },
  { minPrice: 120001, maxPrice: 170000, cashbackPercent: 6 },
  { minPrice: 170001, maxPrice: 250000, cashbackPercent: 7 }
]

async function seedGlobalEmiRules(): Promise<void> {
  for (const bracket of priceBrackets) {
    for (const tenureMonths of zeroInterestTenures) {
      await db.emiRule.create({
        data: {
          minPrice: bracket.minPrice,
          maxPrice: bracket.maxPrice,
          tenureMonths,
          interestRate: 0,
          cashbackPercent: bracket.cashbackPercent
        }
      })
    }

    for (const tenureMonths of interestBearingTenures) {
      await db.emiRule.create({
        data: {
          minPrice: bracket.minPrice,
          maxPrice: bracket.maxPrice,
          tenureMonths,
          interestRate: interestBearingRate,
          cashbackPercent: bracket.cashbackPercent
        }
      })
    }
  }
}

async function seedProducts(): Promise<void> {
  for (const product of products) {
    const createdProduct = await db.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        description: product.description,
        variants: {
          create: product.variants
        }
      }
    })

    if (product.slug === "iphone-17-pro") {
      await db.emiRule.create({
        data: {
          minPrice: 0,
          maxPrice: 250000,
          tenureMonths: 12,
          interestRate: 0,
          cashbackPercent: 9,
          productId: createdProduct.id
        }
      })
    }
  }
}

async function main(): Promise<void> {
  await db.selection.deleteMany()
  await db.emiRule.deleteMany()
  await db.productVariant.deleteMany()
  await db.product.deleteMany()

  await seedGlobalEmiRules()
  await seedProducts()
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (error: unknown) => {
    console.error(error)
    await db.$disconnect()
    process.exit(1)
  })
