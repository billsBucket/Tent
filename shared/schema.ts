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
  profileData: json("profile_data").$type<{
    children?: Array<{
      name: string;
      age: number;
      gender: string;
      allergies?: string;
      specialNeeds?: string;
    }>;
    experience?: string;
    certifications?: string[];
    hourlyRate?: number;
    availability?: Record<string, boolean>;
  }>().default({}),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull(),
  babysitterId: integer("babysitter_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status", { enum: ["pending", "accepted", "completed", "cancelled"] }).notNull(),
  specialInstructions: text("special_instructions"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  phoneNumber: true,
  userType: true,
  fullName: true,
  email: true,
});

export const insertBookingSchema = createInsertSchema(bookings);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
