import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number").notNull(),
  userType: text("user_type", { enum: ["parent", "babysitter"] }).notNull(),
  email: text("email"),
  fullName: text("full_name").notNull(),
  verified: boolean("verified").default(false),
  verificationStatus: text("verification_status", {
    enum: ["pending", "in_progress", "approved", "rejected"]
  }).default("pending"),
  profileData: json("profile_data").$type<{
    // Location Data
    location?: {
      address: string;
      latitude: number;
      longitude: number;
      lastUpdated: string;
    };
    // Verification Data
    governmentId?: {
      type: string;
      number: string;
      expiryDate: string;
      verificationStatus: "pending" | "verified" | "rejected";
    };
    faceVerification?: {
      status: "pending" | "verified" | "rejected";
      lastVerified: string;
    };
    // Parent-specific data
    children?: Array<{
      name: string;
      age: number;
      gender: string;
      allergies?: string;
      specialNeeds?: string;
    }>;
    // Babysitter-specific data
    experience?: string;
    certifications?: string[];
    hourlyRate?: number;
    availability?: Record<string, boolean>;
    backgroundCheck?: {
      status: "pending" | "verified" | "rejected";
      completedAt?: string;
    };
    // Rating and Reviews
    rating?: number;
    totalRatings?: number;
    reviews?: Array<{
      userId: number;
      rating: number;
      comment: string;
      createdAt: string;
    }>;
  }>().default({}),
});

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type", {
    enum: ["government_id", "face", "background_check"]
  }).notNull(),
  status: text("status", {
    enum: ["pending", "in_progress", "approved", "rejected"]
  }).notNull(),
  submittedAt: timestamp("submitted_at").notNull(),
  processedAt: timestamp("processed_at"),
  metadata: json("metadata").$type<{
    documentType?: string;
    documentNumber?: string;
    expiryDate?: string;
    verificationNotes?: string;
    rejectionReason?: string;
  }>(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  phoneNumber: true,
  userType: true,
  fullName: true,
  email: true,
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  submittedAt: true,
  processedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull(),
  babysitterId: integer("babysitter_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status", { enum: ["pending", "accepted", "completed", "cancelled"] }).notNull(),
  serviceType: text("service_type", {
    enum: ["standard", "educational", "special_needs", "overnight"]
  }).notNull(),
  location: text("location").notNull(),
  totalAmount: integer("total_amount").notNull(),
  specialInstructions: json("special_instructions").$type<{
    children: Array<{
      age: number;
      specialNeeds?: string;
    }>;
    duration: number;
    notes?: string;
  }>().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings);
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;