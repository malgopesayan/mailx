import CryptoJS from 'crypto-js';

// Get the secret key from environment variables
const secretKey = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_E2E_ENCRYPTION_KEY);

/**
 * Encrypts a plaintext string using AES-256-CBC.
 * A random Initialization Vector (IV) is generated for each encryption to ensure security.
 * The output is a Base64 string formatted as: "iv_base64:ciphertext_base64"
 * @param {string} plaintext The string to encrypt (e.g., the app password).
 * @returns {string} The combined IV and ciphertext, encoded in Base64.
 */
export function encrypt(plaintext) {
  // Generate a cryptographically secure random 16-byte IV
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt the plaintext using the secret key and the generated IV
  const encrypted = CryptoJS.AES.encrypt(plaintext, secretKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert the IV and the ciphertext to Base64 strings
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
  const ciphertextBase64 = encrypted.toString();

  // Return the combined string, separated by a colon
  return `${ivBase64}:${ciphertextBase64}`;
}