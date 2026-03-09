import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "validation.usernameMin")
    .max(50, "validation.usernameMax"),
  password: z
    .string()
    .min(6, "validation.passwordMin")
    .max(100, "validation.passwordMax"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "validation.usernameMin")
    .max(50, "validation.usernameMax"),
  nationalId: z
    .string()
    .trim()
    .min(5, "validation.nationalIdMin")
    .max(20, "validation.nationalIdMax"),
  password: z
    .string()
    .min(6, "validation.passwordMin")
    .max(100, "validation.passwordMax"),
});

export const propertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "validation.required")
    .max(200, "validation.tooLong"),
  location: z
    .string()
    .trim()
    .min(2, "validation.required")
    .max(300, "validation.tooLong"),
  superficie: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "validation.positiveNumber",
    ),
  status: z.enum(["AVAILABLE", "RENTED", "AUCTION", "CLOSED"]),
  cahierPrice: z
    .string()
    .refine(
      (v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0),
      "validation.positiveNumber",
    ),
  startingAuctionPrice: z
    .string()
    .refine(
      (v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0),
      "validation.positiveNumber",
    ),
});

export const auctionSchema = z.object({
  propertyId: z.string().min(1, "validation.required"),
  startDate: z.string().min(1, "validation.required"),
  endDate: z.string().min(1, "validation.required"),
  startingPrice: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "validation.positiveNumber",
    ),
});

export const requestSchema = z.object({
  type: z
    .string()
    .trim()
    .min(2, "validation.required")
    .max(100, "validation.tooLong"),
  description: z
    .string()
    .trim()
    .min(10, "validation.descriptionMin")
    .max(1000, "validation.tooLong"),
});

export const complaintSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "validation.descriptionMin")
    .max(1000, "validation.tooLong"),
});

export const reviewSchema = z.object({
  content: z
    .string()
    .trim()
    .min(10, "validation.descriptionMin")
    .max(1000, "validation.tooLong"),
});

export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "validation.required")
    .max(200, "validation.tooLong"),
  content: z
    .string()
    .trim()
    .min(10, "validation.descriptionMin")
    .max(2000, "validation.tooLong"),
  language: z.enum(["EN", "AR"]),
});

export const messageSchema = z.object({
  receiverId: z.string().min(1, "validation.required"),
  content: z
    .string()
    .trim()
    .min(1, "validation.required")
    .max(2000, "validation.tooLong"),
});

export const bidSchema = z.object({
  amount: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "validation.positiveNumber",
    ),
});

export const paymentSchema = z.object({
  amount: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "validation.positiveNumber",
    ),
});

export const accountEditSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "validation.usernameMin")
    .max(50, "validation.usernameMax"),
  role: z.enum(["ADMIN", "EMPLOYEE", "CITIZEN"]),
});

export const accountCreateSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "validation.usernameMin")
    .max(50, "validation.usernameMax"),
  nationalId: z
    .string()
    .trim()
    .min(5, "validation.nationalIdMin")
    .max(20, "validation.nationalIdMax"),
  password: z
    .string()
    .min(6, "validation.passwordMin")
    .max(100, "validation.passwordMax"),
  role: z.enum(["EMPLOYEE", "CITIZEN"]),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type PropertyForm = z.infer<typeof propertySchema>;
export type AuctionForm = z.infer<typeof auctionSchema>;
export type RequestForm = z.infer<typeof requestSchema>;
export type ComplaintForm = z.infer<typeof complaintSchema>;
export type ReviewForm = z.infer<typeof reviewSchema>;
export type AnnouncementForm = z.infer<typeof announcementSchema>;
export type MessageForm = z.infer<typeof messageSchema>;
export type BidForm = z.infer<typeof bidSchema>;
export type PaymentForm = z.infer<typeof paymentSchema>;
export type AccountEditForm = z.infer<typeof accountEditSchema>;
export type AccountCreateForm = z.infer<typeof accountCreateSchema>;
