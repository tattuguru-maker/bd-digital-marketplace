import * as z from "zod";

// -----------------------------------------------------------------------------
// Customer signup / login
// -----------------------------------------------------------------------------
export const SignupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long.")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(120)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number (e.g. 01711234567).")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "At least 8 characters.")
    .regex(/[a-zA-Z]/, "Must include at least one letter.")
    .regex(/[0-9]/, "Must include at least one number."),
  agree: z
    .union([z.literal("on"), z.literal("true"), z.literal("")])
    .refine((v) => v === "on" || v === "true", "You must accept the terms."),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const MagicLinkSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
});

// -----------------------------------------------------------------------------
// Seller application (KYC)
// -----------------------------------------------------------------------------
export const SellerApplySchema = z.object({
  displayName: z.string().min(3, "Pick a store display name.").max(60).trim(),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters.")
    .max(24, "Handle too long.")
    .regex(
      /^[a-z0-9_-]+$/,
      "Lowercase letters, numbers, hyphen and underscore only.",
    )
    .trim(),
  location: z.string().min(2, "Required.").max(80).trim(),
  bio: z.string().min(40, "Tell buyers a bit about your store (at least 40 chars).").max(500).trim(),
  nidNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10,17}$/, "Enter a valid 10–17 digit NID number."),
  agreePolicies: z
    .union([z.literal("on"), z.literal("true"), z.literal("")])
    .refine((v) => v === "on" || v === "true", "You must accept the seller policies."),
});

export type SellerApplyInput = z.infer<typeof SellerApplySchema>;

// -----------------------------------------------------------------------------
// FormState shape used by useActionState
// -----------------------------------------------------------------------------
export type AuthFormState =
  | {
      ok?: false;
      message?: string;
      errors?: Record<string, string[]>;
    }
  | {
      ok: true;
      message?: string;
      redirect?: string;
    }
  | undefined;
