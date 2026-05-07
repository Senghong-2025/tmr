import bcrypt from "bcryptjs";

const iterations = 120000;
const keyLength = 32;
const bcryptSaltRounds = 12;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBuffer,
      iterations,
    },
    key,
    keyLength * 8
  );

  return bytesToHex(new Uint8Array(bits));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, bcryptSaltRounds);
}

export async function verifyPassword(password: string, storedHash: string) {
  if (
    storedHash.startsWith("$2a$") ||
    storedHash.startsWith("$2b$") ||
    storedHash.startsWith("$2y$")
  ) {
    return bcrypt.compare(password, storedHash);
  }

  const [algorithm, storedIterations, saltHex, hash] = storedHash.split("$");

  if (
    algorithm !== "pbkdf2_sha256" ||
    Number(storedIterations) !== iterations ||
    !saltHex ||
    !hash
  ) {
    return false;
  }

  const candidateHash = await derivePasswordHash(password, hexToBytes(saltHex));

  return constantTimeEqual(candidateHash, hash);
}
