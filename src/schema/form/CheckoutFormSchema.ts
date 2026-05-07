import { z } from "zod";

export const CheckoutFormSchema = z.object({});

export type CheckoutFormInput = z.input<typeof CheckoutFormSchema>;
export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;
