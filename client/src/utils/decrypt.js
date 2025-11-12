import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('mysecretaeskey12');
const iv = CryptoJS.enc.Utf8.parse('myiv456789012345');

export function decryptData(base64Cipher) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(base64Cipher) },
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8).trim();

    try {
      const parsed = JSON.parse(decryptedText);
      return typeof parsed === 'string' ? parsed : parsed;
    } catch {
      return decryptedText;
    }
  } catch (error) {
    // console.error('Decryption failed:', error);
    return null;
  }
}

