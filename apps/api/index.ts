import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getRestaurants } from "./routes/restaurants";
import { postVisit, getVisits } from "./routes/visits";
import { getRankings } from "./routes/rankings";
import { attachUser, login, logout, me, register } from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(attachUser);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", me);

  // Ramen app routes
  app.get("/api/restaurants", getRestaurants);
  app.get("/api/visits", getVisits);
  app.post("/api/visits", postVisit);
  app.get("/api/rankings", getRankings);

  return app;
}
