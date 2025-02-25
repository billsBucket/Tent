import { User, InsertUser, Booking, InsertBooking, Verification, InsertVerification } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerificationStatus(userId: number, status: string): Promise<void>;
  getBabysitters(): Promise<User[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createVerification(verification: InsertVerification): Promise<Verification>;
  getUserVerifications(userId: number): Promise<Verification[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookings: Map<number, Booking>;
  private verifications: Map<number, Verification>;
  private currentUserId: number;
  private currentBookingId: number;
  private currentVerificationId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.verifications = new Map();
    this.currentUserId = 1;
    this.currentBookingId = 1;
    this.currentVerificationId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      verified: false,
      verificationStatus: "pending",
      profileData: {},
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserVerificationStatus(userId: number, status: string): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.verificationStatus = status;
      this.users.set(userId, user);
    }
  }

  async getBabysitters(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.userType === "babysitter" && user.verified
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.parentId === userId || booking.babysitterId === userId
    );
  }

  async createVerification(insertVerification: InsertVerification): Promise<Verification> {
    const id = this.currentVerificationId++;
    const verification: Verification = {
      ...insertVerification,
      id,
      submittedAt: new Date(),
      processedAt: null,
    };
    this.verifications.set(id, verification);
    return verification;
  }

  async getUserVerifications(userId: number): Promise<Verification[]> {
    return Array.from(this.verifications.values()).filter(
      (verification) => verification.userId === userId
    );
  }
}

export const storage = new MemStorage();