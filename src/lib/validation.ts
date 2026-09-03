import { z } from "zod"

export const createSelectionSchema = z.object({
  variantId: z.string().min(1, "variantId is required"),
  tenureMonths: z.number().int().positive("tenureMonths must be a positive integer")
})

export type CreateSelectionInput = z.infer<typeof createSelectionSchema>
