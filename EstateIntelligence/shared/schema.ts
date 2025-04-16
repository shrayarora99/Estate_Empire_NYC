import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // tenant, landlord, admin
  phone: text("phone"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Tenant credential profile
export const tenantProfiles = pgTable("tenant_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  incomeVerified: boolean("income_verified").default(false),
  creditScoreVerified: boolean("credit_score_verified").default(false),
  rentalHistoryVerified: boolean("rental_history_verified").default(false),
  employmentVerified: boolean("employment_verified").default(false),
  incomeScore: integer("income_score"),
  creditScore: integer("credit_score"),
  rentalHistoryScore: integer("rental_history_score"),
  employmentScore: integer("employment_score"),
  overallScore: integer("overall_score"),
  verificationBadge: boolean("verification_badge").default(false),
  verifiedAt: timestamp("verified_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTenantProfileSchema = createInsertSchema(tenantProfiles).omit({
  id: true,
  updatedAt: true,
});

// Properties model
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  landlordId: integer("landlord_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  pricePerMonth: real("price_per_month").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: real("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  propertyType: text("property_type").notNull(), // apartment, house, condo, etc.
  availableFrom: date("available_from").notNull(),
  featured: boolean("featured").default(false),
  images: jsonb("images").default([]),
  minimumIncome: real("minimum_income"),
  minimumCreditScore: integer("minimum_credit_score"),
  requiredRentalHistory: integer("required_rental_history"), // in months
  requiredEmploymentStability: integer("required_employment_stability"), // in months
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Document storage
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(), // income_proof, credit_report, rental_history, employment_proof
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  verified: true,
  verifiedAt: true,
  uploadedAt: true,
});

// Property Views / Applications
export const propertyViews = pgTable("property_views", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  tenantId: integer("tenant_id").notNull().references(() => users.id),
  matchScore: integer("match_score").notNull(),
  applicationStatus: text("application_status").default("pending"), // pending, approved, rejected
  viewingDate: timestamp("viewing_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertyViewSchema = createInsertSchema(propertyViews).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TenantProfile = typeof tenantProfiles.$inferSelect;
export type InsertTenantProfile = z.infer<typeof insertTenantProfileSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type PropertyView = typeof propertyViews.$inferSelect;
export type InsertPropertyView = z.infer<typeof insertPropertyViewSchema>;
