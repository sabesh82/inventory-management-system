import { z } from "zod";

export const ItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Price must be a valid number")
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Price must be a positive number")
    .transform((val) => String(val)),
  dealerEmail: z.string().trim().email("Invalid email format"),
});

export type ItemInput = z.infer<typeof ItemSchema>;
