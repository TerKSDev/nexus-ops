import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes long.");
  }
  return key;
};

export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getEncryptionKey()), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encryptedText
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(text: string): string {
  if (!text) return text;
  if (!text.includes(":")) return text; // Fallback for old unencrypted plain text

  try {
    const [ivHex, authTagHex, encryptedText] = text.split(":");
    if (!ivHex || !authTagHex || !encryptedText) return text;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(getEncryptionKey()), iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    // If decryption fails (e.g. wrong key, malformed), returning empty or old text is safe, 
    // but throwing might break the whole UI. We'll return an empty string to prevent crashing.
    return "";
  }
}
