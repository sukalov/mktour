// encrypt-decrypt.ts

const SECRET_KEY_LENGTH = 32;

/**
 * Derives a consistent, repeatable "key stream" from a secret key.
 * This is a very basic derivation and NOT cryptographically secure.
 * @param secretKey The secret key string.
 * @returns A Uint8Array representing the key stream.
 */
function deriveKeyStream(): Uint8Array {
  const secretKey = process.env.SECRET_KEY ?? '';
  const keyBytes = new TextEncoder().encode(secretKey);
  const keyStream = new Uint8Array(SECRET_KEY_LENGTH);

  for (let i = 0; i < SECRET_KEY_LENGTH; i++) {
    keyStream[i] = keyBytes[i % keyBytes.length] || 0; // Simple repetition/padding
  }
  return keyStream;
}

/**
 * Encrypts a string using a simple XOR cipher and a secret key.
 * The output is a base64url encoded string (which does not contain ':').
 * @param text The string to encrypt.
 * @param secretKey The secret key.
 * @returns The encrypted, base64url encoded string.
 */
export function encrypt(text: string): string {
  const textBytes = new TextEncoder().encode(text);
  const keyStream = deriveKeyStream();
  const encryptedBytes = new Uint8Array(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    encryptedBytes[i] = textBytes[i] ^ keyStream[i % keyStream.length];
  }

  // Convert to Base64URL to avoid colons and other problematic characters
  return base64UrlEncode(encryptedBytes);
}

/**
 * Decrypts a base64url encoded string using a simple XOR cipher and a secret key.
 * @param encryptedText The encrypted, base64url encoded string.
 * @param secretKey The secret key.
 * @returns The decrypted string.
 */
export function decrypt(encryptedText: string): string {
  const encryptedBytes = base64UrlDecode(encryptedText);
  const keyStream = deriveKeyStream();
  const decryptedBytes = new Uint8Array(encryptedBytes.length);

  for (let i = 0; i < encryptedBytes.length; i++) {
    decryptedBytes[i] = encryptedBytes[i] ^ keyStream[i % keyStream.length];
  }

  return new TextDecoder().decode(decryptedBytes);
}

/**
 * Encodes a Uint8Array to a Base64URL string.
 * This avoids '+', '/', and '=' characters, replacing them with '-', '_', and omitting padding respectively.
 * @param bytes The Uint8Array to encode.
 * @returns The Base64URL string.
 */
function base64UrlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove padding
}

/**
 * Decodes a Base64URL string to a Uint8Array.
 * @param base64urlString The Base64URL string to decode.
 * @returns The decoded Uint8Array.
 */
function base64UrlDecode(base64urlString: string): Uint8Array {
  // Add padding back if necessary for btoa/atob compatibility
  let padded = base64urlString.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4) {
    padded += '=';
  }
  return new Uint8Array(
    atob(padded)
      .split('')
      .map((char) => char.charCodeAt(0)),
  );
}
