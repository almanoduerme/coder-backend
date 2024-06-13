import { Bootstrap } from "./app";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

try {
  const server = new Bootstrap();
  server.start();
} catch (error) {
  console.error(error);
}