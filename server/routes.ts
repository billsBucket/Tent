import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertBookingSchema, insertVerificationSchema } from "@shared/schema";
import { setupWebSocket } from "./socket";
import multer from "multer";
import axios from "axios";
import { stripe, createPaymentIntent } from "./stripe";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // ID Verification endpoint
  app.post("/api/verify/id", upload.single("idImage"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    try {
      const idAnalyzerResponse = await axios.post(
        "https://api.idanalyzer.com",
        {
          apikey: process.env.ID_ANALYZER_API_KEY,
          file: req.file.buffer.toString("base64"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = idAnalyzerResponse;

      if (data.result) {
        res.json({
          verified: true,
          documentType: data.result.type,
          documentNumber: data.result.number,
          expiryDate: data.result.expiry,
        });
      } else {
        res.status(400).json({
          verified: false,
          message: "ID verification failed. Please try again with a clearer image.",
        });
      }
    } catch (error) {
      console.error("ID verification error:", error);
      res.status(500).json({
        verified: false,
        message: "Error processing ID verification",
      });
    }
  });

  // Add after the ID verification endpoint
  app.post("/api/verify/face", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ message: "No image data provided" });
    }

    try {
      // Remove the data:image/jpeg;base64 prefix
      const base64Image = imageData.split(',')[1];

      // For now, we'll simulate face verification
      // In production, integrate with a face verification service
      const simulateVerification = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              verified: true,
              confidence: 0.98,
              message: "Face verification successful"
            });
          }, 2000);
        });
      };

      const verificationResult = await simulateVerification();
      res.json(verificationResult);
    } catch (error) {
      console.error("Face verification error:", error);
      res.status(500).json({
        verified: false,
        message: "Error processing face verification",
      });
    }
  });

  app.get("/api/babysitters", async (req, res) => {
    const babysitters = await storage.getBabysitters();
    res.json(babysitters);
  });

  app.get("/api/babysitters/:id", async (req, res) => {
    const babysitter = await storage.getUser(parseInt(req.params.id));
    if (!babysitter || babysitter.userType !== "babysitter") {
      return res.status(404).send("Babysitter not found");
    }
    res.json(babysitter);
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const booking = insertBookingSchema.parse({
      ...req.body,
      parentId: req.user!.id,
      status: "pending"
    });

    const newBooking = await storage.createBooking(booking);
    res.status(201).json(newBooking);
  });

  app.get("/api/bookings/:userId", async (req, res) => {
    const bookings = await storage.getUserBookings(parseInt(req.params.userId));
    res.json(bookings);
  });

  app.get("/api/bookings/:id", async (req, res) => {
    const booking = await storage.getBooking(parseInt(req.params.id));
    if (!booking) {
      return res.status(404).send("Booking not found");
    }
    res.json(booking);
  });

  // Verifications endpoints
  app.post("/api/verifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const verification = insertVerificationSchema.parse({
      ...req.body,
      userId: req.user!.id,
      status: "pending",
      submittedAt: new Date(),
    });

    const newVerification = await storage.createVerification(verification);
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

  // Create payment intent endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await createPaymentIntent(amount);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Stripe webhook endpoint
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment
        // Update booking status, send notifications, etc.
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);
  setupWebSocket(httpServer);
  return httpServer;
}