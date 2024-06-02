import crypto from "crypto";

const generateId = (): string => crypto.randomBytes(16).toString("hex");
export { generateId }