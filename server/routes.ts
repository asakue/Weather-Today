import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're building a static app for GitHub Pages,
  // we don't need any specific backend routes.
  // All API calls will be made directly from the client
  // to the OpenWeatherMap API.
  
  const httpServer = createServer(app);
  return httpServer;
}
