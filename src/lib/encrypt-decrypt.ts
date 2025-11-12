// encrypt-decrypt.ts

import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const ALGORITHM = 'aes-256-cbc';

function getSecretKey(): string {
  const key = process.env.SECRET_KEY;
  if (!key || key.length < 32) {
    throw new Error(
      'SECRET_KEY must be at least 32 characters and match between app and ws server',
    );
  }
  return key;
}

function deriveKey(salt: Buffer): Buffer {
  const secretKey = getSecretKey();
  return pbkdf2Sync(secretKey, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

export function encrypt(text: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const combined = Buffer.concat([salt, iv, Buffer.from(encrypted, 'base64')]);

  return base64UrlEncode(combined);
}

export function decrypt(encryptedText: string): string {
  const combined = base64UrlDecode(encryptedText);

  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encryptedBytes = combined.subarray(SALT_LENGTH + IV_LENGTH);

  const key = deriveKey(salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedBytes);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(base64urlString: string): Buffer {
  let padded = base64urlString.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4) {
    padded += '=';
  }
  return Buffer.from(padded, 'base64');
}

if (require.main === module) {
  const originalString =
    'hello websocket! this message travels between app and ws server.';

  try {
    const encrypted = encrypt(originalString);
    console.log('original:', originalString);
    console.log('encrypted:', encrypted);
    console.log("contains ':'?", encrypted.includes(':'));

    const decrypted = decrypt(encrypted);
    console.log('decrypted:', decrypted);
    console.log('success:', originalString === decrypted);
  } catch (error) {
    console.error('error:', error);
  }
}
