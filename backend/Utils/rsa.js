import crypto from "crypto";
import fs from "fs";
import path from "path";

// Cargar la llave privada desde archivo
const PRIVATE_KEY_PATH = path.resolve("keys/private_key.pem");
const PUBLIC_KEY_PATH = path.resolve("keys/public_key.pem");

export const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
export const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");

// Función para cifrar (frontend puede usar la pública)
export const cifrarMonto = (monto) => {
  const buffer = Buffer.from(monto.toString(), "utf8");
  const encrypted = crypto.publicEncrypt(PUBLIC_KEY, buffer);
  return encrypted.toString("base64");
};

// Función para descifrar (backend)
export const descifrarMonto = (montoCifrado) => {
  const buffer = Buffer.from(montoCifrado, "base64");
  const decrypted = crypto.privateDecrypt(PRIVATE_KEY, buffer);
  return decrypted.toString("utf8");
};
