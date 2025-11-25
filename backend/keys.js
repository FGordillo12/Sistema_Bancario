import { generateKeyPairSync } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname real usando ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde queremos guardar SI O SI
const publicPath = path.join(__dirname, "public.pem");
const privatePath = path.join(__dirname, "private.pem");

try {
  // Generar llaves
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  // Guardar llaves
  fs.writeFileSync(publicPath, publicKey);
  fs.writeFileSync(privatePath, privateKey);

  console.log("Llaves RSA generadas correctamente!");
  console.log("📄 Public key:", publicPath);
  console.log("📄 Private key:", privatePath);
} catch (err) {
  console.error("Error al generar o guardar las llaves:", err);
}
