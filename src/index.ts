import { Server } from "./app";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

try {
  const server = new Server();
  server.start();
} catch (error) {
  console.error(error);
}