import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertBookingSchema, insertVerificationSchema } from "@shared/schema";
import { setupWebSocket } from "./socket";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/babysitters", async (req, res) => {
    const babysitters = await storage.getBabysitters();
    res.json(babysitters);
  });

  app.post("/api/bookings", async (req, res) => {
    const booking = insertBookingSchema.parse(req.body);
    const newBooking = await storage.createBooking(booking);
    res.status(201).json(newBooking);
  });

  app.get("/api/bookings/:userId", async (req, res) => {
    const bookings = await storage.getUserBookings(parseInt(req.params.userId));
    res.json(bookings);
  });

  // Verification endpoints
  app.post("/api/verifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const verification = insertVerificationSchema.parse({
      ...req.body,
      userId: req.user!.id,
      status: "pending",
    });

    const newVerification = await storage.createVerification(verification);

    // Update user's verification status
    await storage.updateUserVerificationStatus(req.user!.id, "in_progress");

    res.status(201).json(newVerification);
  });

  app.get("/api/verifications/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const verifications = await storage.getUserVerifications(parseInt(req.params.userId));
    res.json(verifications);
  });

  const httpServer = createServer(app);

  // Setup WebSocket server
  setupWebSocket(httpServer);

  return httpServer;
}