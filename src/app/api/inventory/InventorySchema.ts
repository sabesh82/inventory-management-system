// InventorySchema.ts
import { z } from "zod";

export const InventorySchema = z.object({
  itemId: z
    .string({ required_error: "Item id is required." })
    .trim()
    .min(1, "Item id is required."),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Quantity must be a valid number")
    .transform((val) => Number(val))
    .refine((val) => val >= 0, "Quantity must be a positive number")
    .transform((val) => String(val)),
});

export type InventoryInput = z.infer<typeof InventorySchema>;
