const { z } = require("zod");

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(6).max(255),
});

const registerSchema = z.object({
  username: z.string().min(1).max(100),
  nationalId: z.string().min(1).max(50),
  password: z.string().min(6).max(255),
  role: z.enum(["ADMIN", "EMPLOYEE", "CITIZEN"]).optional().default("CITIZEN"),
});

const propertySchema = z.object({
  title: z.string().min(1).max(255),
  superficie: z.coerce.number().positive().optional(),
  status: z.enum(["AVAILABLE", "RENTED", "AUCTION", "CLOSED"]).optional(),
  location: z.string().max(255).optional(),
  startingAuctionPrice: z.coerce.number().positive().optional(),
  cahierPrice: z.coerce.number().min(0).optional(),
});

const auctionSchema = z.object({
  propertyId: z.string().uuid(),
  startDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date format"),
  endDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date format"),
  startingPrice: z.coerce.number().positive(),
});

const bidSchema = z.object({
  amount: z.coerce.number().positive(),
});

const paymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.coerce.number().positive(),
});

const requestSchema = z.object({
  type: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
});

const complaintSchema = z.object({
  description: z.string().min(1).max(2000),
});

const reviewSchema = z.object({
  content: z.string().min(1).max(2000),
});

const announcementSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(5000),
  language: z.enum(["EN", "AR"]),
});

const messageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

const adminCreateUserSchema = z.object({
  username: z.string().min(1).max(100),
  nationalId: z.string().min(1).max(50),
  password: z.string().min(6).max(255),
  role: z.enum(["EMPLOYEE", "CITIZEN"]),
});

const documentUploadSchema = z.object({
  documentType: z
    .enum(["RESIDENCE_CERTIFICATE", "BIRTH_CERTIFICATE", "TAX_CLEARANCE_CERTIFICATE", "TAX_ID_NUMBER"])
    .default("RESIDENCE_CERTIFICATE"),
});

module.exports = {
  loginSchema,
  registerSchema,
  propertySchema,
  auctionSchema,
  bidSchema,
  paymentSchema,
  requestSchema,
  complaintSchema,
  reviewSchema,
  announcementSchema,
  messageSchema,
  adminCreateUserSchema,
  documentUploadSchema,
};
