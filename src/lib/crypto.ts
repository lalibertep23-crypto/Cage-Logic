// App-layer encryption for sensitive fields (health baseline, psych
// assessments, injury notes, post-loss reflections).
//
// Algorithm: AES-256-GCM with random 96-bit IV per encryption and 128-bit auth tag.
// Wire format (base64): IV (12 bytes) || authTag (16 bytes) || ciphertext.
//
// Key: 32 bytes, supplied as base64 in the `CAGE_LOGIC_FIELD_ENC_KEY` env var.
// (Legacy name `CAGESIDE_FIELD_ENC_KEY` is still read as a fallback, so an
//  existing .env.local keeps working until it's renamed.)
// Generate with:
//   PowerShell:  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
//   Git Bash:    openssl rand -base64 32
//
// NEVER commit the key. NEVER expose it to the client. Server-only.

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_ENV = 'CAGE_LOGIC_FIELD_ENC_KEY';
// Legacy name — still read as a fallback so an existing .env.local keeps working.
const LEGACY_KEY_ENV = 'CAGESIDE_FIELD_ENC_KEY';

function getKey(): Buffer {
  const raw = process.env[KEY_ENV] ?? process.env[LEGACY_KEY_ENV];
  if (!raw) {
    throw new Error(
      `${KEY_ENV} is not set. Generate a 32-byte key (see src/lib/crypto.ts) and put it in .env.local, then restart the dev server.`
    );
  }
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error(
      `${KEY_ENV} must be a base64-encoded 32-byte key. Got ${buf.length} bytes.`
    );
  }
  return buf;
}

/**
 * Encrypt a string. Returns base64(iv || authTag || ciphertext).
 * Returns null for null/undefined/empty input — so empty fields stay NULL in the DB.
 */
export function encryptField(plain: string | null | undefined): string | null {
  if (plain == null || plain.length === 0) return null;
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

/**
 * Decrypt the inverse of encryptField. Throws on tampered or wrong-key input.
 */
export function decryptField(blob: string | null | undefined): string | null {
  if (blob == null || blob.length === 0) return null;
  const key = getKey();
  const buf = Buffer.from(blob, 'base64');
  if (buf.length < IV_LEN + TAG_LEN) {
    throw new Error('Encrypted blob is too short.');
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ct = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString('utf8');
}
