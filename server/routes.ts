import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/babysitters", (req, res) => {
    const babysitters = storage.getBabysitters();
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

  const httpServer = createServer(app);
  return httpServer;
}
